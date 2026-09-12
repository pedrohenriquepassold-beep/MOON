import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("home");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    birthDate: "",
    email: "",
    password: "",
    terms: false,
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [profileForm, setProfileForm] = useState({
    city: "",
    bio: "",
    gender: "",
    sexuality: "",
    position: "",
    availability: "",
  });

  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);

  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [nearbyProfiles, setNearbyProfiles] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        await loadProfile(data.session.user.id);
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          await loadProfile(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(
        "ERRO AO CARREGAR PERFIL:",
        error
      );

      setScreen("profile");
      return;
    }

    setProfileForm({
      city: data.city || "",
      bio: data.bio || "",
      gender: data.gender || "",
      sexuality: data.sexuality || "",
      position: data.position || "",
      availability: data.availability || "",
    });

    const hasLocation =
      data.latitude !== null &&
      data.latitude !== undefined &&
      data.longitude !== null &&
      data.longitude !== undefined;

    setLocationSaved(hasLocation);

    setUserLocation({
      latitude: data.latitude || null,
      longitude: data.longitude || null,
    });

    await loadPhotos(userId);

    if (
      data.city &&
      data.gender &&
      data.sexuality &&
      hasLocation
    ) {
      setScreen("inside");

      await loadNearbyProfiles(
        data.latitude,
        data.longitude
      );
    } else {
      setScreen("profile");
    }
  }

  async function loadPhotos(userId) {
    const { data, error } = await supabase
      .from("profile_photos")
      .select("*")
      .eq("user_id", userId)
      .order("is_primary", {
        ascending: false,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "ERRO AO CARREGAR FOTOS:",
        error
      );

      return;
    }

    const photosWithUrl =
      (data || []).map((photo) => {
        const { data: publicData } =
          supabase.storage
            .from("profile-photos")
            .getPublicUrl(
              photo.storage_path
            );

        return {
          ...photo,
          publicUrl:
            publicData.publicUrl,
        };
      });

    setPhotos(photosWithUrl);
  }

  async function loadNearbyProfiles(
    latitude,
    longitude
  ) {
    if (
      latitude === null ||
      latitude === undefined ||
      longitude === null ||
      longitude === undefined
    ) {
      return;
    }

    setDiscoveryLoading(true);

    try {
      const { data, error } =
        await supabase.rpc(
          "get_nearby_profiles",
          {
            user_lat: latitude,
            user_lng: longitude,
            max_distance_km: 50,
          }
        );

      if (error) {
        throw error;
      }

      const profiles =
        data || [];

      const profilesWithPhotos =
        await Promise.all(
          profiles.map(
            async (profile) => {
              const {
                data: photoData,
                error: photoError,
              } = await supabase
                .from("profile_photos")
                .select(
                  "id, storage_path, is_primary"
                )
                .eq(
                  "user_id",
                  profile.id
                )
                .order(
                  "is_primary",
                  {
                    ascending: false,
                  }
                )
                .order(
                  "created_at",
                  {
                    ascending: true,
                  }
                )
                .limit(1);

              if (
                photoError ||
                !photoData ||
                photoData.length === 0
              ) {
                return {
                  ...profile,
                  photoUrl: null,
                };
              }

              const photo =
                photoData[0];

              const {
                data: publicData,
              } = supabase.storage
                .from(
                  "profile-photos"
                )
                .getPublicUrl(
                  photo.storage_path
                );

              return {
                ...profile,
                photoUrl:
                  publicData.publicUrl,
              };
            }
          )
        );

      setNearbyProfiles(
        profilesWithPhotos
      );

    } catch (error) {
      console.error(
        "ERRO AO CARREGAR DISCOVERY:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível carregar pessoas próximas."
      );
    } finally {
      setDiscoveryLoading(false);
    }
  }

  function calculateAge(
    birthDate
  ) {
    if (!birthDate) {
      return "";
    }

    const today =
      new Date();

    const birth =
      new Date(
        birthDate +
          "T00:00:00"
      );

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const monthDifference =
      today.getMonth() -
      birth.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          birth.getDate()
      )
    ) {
      age--;
    }

    return age;
  }

  function getOnlineStatus(
    lastActiveAt
  ) {
    if (!lastActiveAt) {
      return "RECENTE";
    }

    const lastActive =
      new Date(
        lastActiveAt
      ).getTime();

    const now =
      Date.now();

    const difference =
      now - lastActive;

    const minutes =
      difference /
      (1000 * 60);

    if (minutes <= 5) {
      return "ONLINE";
    }

    if (minutes <= 60) {
      return "RECENTE";
    }

    return "";
  }

  function formatDistance(
    distance
  ) {
    if (
      distance === null ||
      distance === undefined
    ) {
      return "";
    }

    if (distance < 1) {
      return `${Math.round(
        distance * 1000
      )} m`;
    }

    if (distance < 10) {
      return `${distance.toFixed(
        1
      )} km`;
    }

    return `${Math.round(
      distance
    )} km`;
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });

    setMessage("");
  }

  function handleLoginChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setLoginForm({
      ...loginForm,
      [name]: value,
    });

    setMessage("");
  }

  function handleProfileChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setProfileForm({
      ...profileForm,
      [name]: value,
    });

    setMessage("");
  }

  async function handleUseLocation() {
    setMessage("");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setMessage(
        "Seu navegador não suporta localização."
      );

      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            data: {
              user,
            },
          } =
            await supabase.auth.getUser();

          if (!user) {
            throw new Error(
              "Usuário não encontrado."
            );
          }

          const latitude =
            position.coords
              .latitude;

          const longitude =
            position.coords
              .longitude;

          const { error } =
            await supabase
              .from("profiles")
              .update({
                latitude,
                longitude,
                last_active_at:
                  new Date().toISOString(),
                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                "id",
                user.id
              );

          if (error) {
            throw error;
          }

          setLocationSaved(
            true
          );

          setUserLocation({
            latitude,
            longitude,
          });

          await loadNearbyProfiles(
            latitude,
            longitude
          );

          setMessage(
            "Localização atualizada! 🌙"
          );

        } catch (error) {
          console.error(
            "ERRO AO SALVAR LOCALIZAÇÃO:",
            error
          );

          setMessage(
            error.message ||
            "Não foi possível salvar sua localização."
          );
        } finally {
          setLocationLoading(
            false
          );
        }
      },

      (error) => {
        console.error(
          "ERRO DE GEOLOCALIZAÇÃO:",
          error
        );

        if (
          error.code === 1
        ) {
          setMessage(
            "Permita o acesso à localização para continuar."
          );
        } else if (
          error.code === 2
        ) {
          setMessage(
            "Não foi possível encontrar sua localização."
          );
        } else if (
          error.code === 3
        ) {
          setMessage(
            "A localização demorou muito para responder."
          );
        } else {
          setMessage(
            "Não foi possível obter sua localização."
          );
        }

        setLocationLoading(
          false
        );
      },

      {
        enableHighAccuracy:
          true,
        timeout: 15000,
        maximumAge:
          300000,
      }
    );
  }

  async function refreshDiscovery() {
    setMessage("");

    if (
      userLocation.latitude ===
        null ||
      userLocation.longitude ===
        null
    ) {
      setMessage(
        "Sua localização ainda não foi encontrada."
      );

      return;
    }

    await loadNearbyProfiles(
      userLocation.latitude,
      userLocation.longitude
    );
  }


  async function handleLike(profileId) {
    setMessage("");

    try {
      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Usuário não encontrado."
        );
      }

      const {
        error,
      } = await supabase
        .from("likes")
        .insert({
          user_id: user.id,
          liked_user_id: profileId,
        });

      if (error) {
        if (
          error.code === "23505"
        ) {
          setMessage(
            "Você já curtiu este perfil. ❤️"
          );
          return;
        }

        throw error;
      }

      setMessage(
        "Perfil curtido. ❤️"
      );

    } catch (error) {
      console.error(
        "ERRO AO CURTIR PERFIL:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível curtir este perfil."
      );
    }
  }

  function handlePhotoChange(
    event
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      photos.length >= 5
    ) {
      setMessage(
        "Você já possui 5 fotos."
      );

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setMessage(
        "Escolha uma imagem JPG, PNG ou WEBP."
      );

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setMessage(
        "A foto deve ter no máximo 10 MB."
      );

      return;
    }

    setPhotoFile(file);
    setMessage("");
  }

  async function handlePhotoUpload() {
    if (!photoFile) {
      setMessage(
        "Escolha uma foto primeiro."
      );

      return;
    }

    if (
      photos.length >= 5
    ) {
      setMessage(
        "Você já possui 5 fotos."
      );

      return;
    }

    setPhotoLoading(true);
    setMessage("");

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Usuário não encontrado."
        );
      }

      const fileExtension =
        photoFile.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;

      const filePath =
        `${user.id}/${fileName}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            "profile-photos"
          )
          .upload(
            filePath,
            photoFile,
            {
              contentType:
                photoFile.type,
              upsert: false,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const isFirstPhoto =
        photos.length === 0;

      const {
        error:
          photoDatabaseError,
      } =
        await supabase
          .from(
            "profile_photos"
          )
          .insert({
            user_id:
              user.id,
            storage_path:
              filePath,
            is_primary:
              isFirstPhoto,
          });

      if (
        photoDatabaseError
      ) {
        throw photoDatabaseError;
      }

      setPhotoFile(null);

      await loadPhotos(
        user.id
      );

      setMessage(
        "Foto adicionada com sucesso! 🌙"
      );

    } catch (error) {
      console.error(
        "ERRO AO ENVIAR FOTO:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível enviar a foto."
      );
    } finally {
      setPhotoLoading(
        false
      );
    }
  }

  async function handleSetPrimary(
    photoId
  ) {
    setPhotoLoading(true);
    setMessage("");

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Usuário não encontrado."
        );
      }

      await supabase
        .from(
          "profile_photos"
        )
        .update({
          is_primary:
            false,
        })
        .eq(
          "user_id",
          user.id
        );

      const {
        error,
      } =
        await supabase
          .from(
            "profile_photos"
          )
          .update({
            is_primary:
              true,
          })
          .eq(
            "id",
            photoId
          )
          .eq(
            "user_id",
            user.id
          );

      if (error) {
        throw error;
      }

      await loadPhotos(
        user.id
      );

      setMessage(
        "Foto principal atualizada! 🌙"
      );

    } catch (error) {
      console.error(
        "ERRO AO DEFINIR FOTO PRINCIPAL:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível definir a foto principal."
      );
    } finally {
      setPhotoLoading(
        false
      );
    }
  }

  async function handleDeletePhoto(
    photo
  ) {
    if (
      photos.length === 1
    ) {
      setMessage(
        "Você precisa manter pelo menos uma foto."
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        "Deseja realmente excluir esta foto?"
      );

    if (!confirmDelete) {
      return;
    }

    setPhotoLoading(true);
    setMessage("");

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Usuário não encontrado."
        );
      }

      const {
        error: storageError,
      } =
        await supabase.storage
          .from(
            "profile-photos"
          )
          .remove([
            photo.storage_path,
          ]);

      if (storageError) {
        throw storageError;
      }

      const {
        error:
          databaseError,
      } =
        await supabase
          .from(
            "profile_photos"
          )
          .delete()
          .eq(
            "id",
            photo.id
          )
          .eq(
            "user_id",
            user.id
          );

      if (databaseError) {
        throw databaseError;
      }

      await loadPhotos(
        user.id
      );

      setMessage(
        "Foto excluída."
      );

    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR FOTO:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível excluir a foto."
      );
    } finally {
      setPhotoLoading(
        false
      );
    }
  }

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    setMessage("");

    if (!form.terms) {
      setMessage(
        "Aceite os Termos e a Política de Privacidade."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } =
        await supabase.auth
          .signUp({
            email:
              form.email,
            password:
              form.password,
          });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error(
          "Não foi possível criar a conta."
        );
      }

      const {
        error:
          profileError,
      } =
        await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            name: form.name,
            birth_date:
              form.birthDate,
          });

      if (profileError) {
        throw profileError;
      }

      setMessage(
        "Conta criada! Bem-vindo à MOON."
      );

      setForm({
        name: "",
        birthDate: "",
        email: "",
        password: "",
        terms: false,
      });

    } catch (error) {
      console.error(
        "ERRO NO CADASTRO:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível criar sua conta."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(
    event
  ) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const {
        data,
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              loginForm.email,
            password:
              loginForm.password,
          });

      if (error) {
        throw error;
      }

      await loadProfile(
        data.user.id
      );

      setLoginForm({
        email: "",
        password: "",
      });

    } catch (error) {
      console.error(
        "ERRO NO LOGIN:",
        error
      );

      setMessage(
        error.message ||
        "E-mail ou senha incorretos."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleProfileSubmit(
    event
  ) {
    event.preventDefault();

    setMessage("");

    if (!locationSaved) {
      setMessage(
        "Use sua localização antes de continuar."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Usuário não encontrado."
        );
      }

      const {
        error,
      } =
        await supabase
          .from("profiles")
          .update({
            city:
              profileForm.city,
            bio:
              profileForm.bio,
            gender:
              profileForm.gender,
            sexuality:
              profileForm.sexuality,
            position:
              profileForm.position,
            availability:
              profileForm.availability,
            last_active_at:
              new Date().toISOString(),
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            user.id
          );

      if (error) {
        throw error;
      }

      setScreen("inside");

      await loadNearbyProfiles(
        userLocation.latitude,
        userLocation.longitude
      );

      setMessage("");

    } catch (error) {
      console.error(
        "ERRO AO SALVAR PERFIL:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível salvar seu perfil."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setScreen("home");
    setMessage("");
    setPhotos([]);
    setPhotoFile(null);
    setLocationSaved(false);

    setUserLocation({
      latitude: null,
      longitude: null,
    });

    setNearbyProfiles([]);
  }

  if (checkingSession) {
    return (
      <main className="moon-app">

        <section className="home-screen">

          <div className="moon-logo">
            MOON
          </div>

          <p className="moon-tagline">
            FIND YOUR NIGHT.
          </p>

        </section>

      </main>
    );
  }

  return (
    <main className="moon-app">

      {/* TELA INICIAL */}

      {screen === "home" && (
        <section className="home-screen">

          <div className="moon-logo">
            MOON
          </div>

          <p className="moon-tagline">
            FIND YOUR NIGHT.
          </p>

          <div className="home-buttons">

            <button
              onClick={() =>
                setScreen(
                  "login"
                )
              }
            >
              ENTER
            </button>

            <button
              onClick={() =>
                setScreen(
                  "register"
                )
              }
            >
              CREATE ACCOUNT
            </button>

          </div>

        </section>
      )}

      {/* CADASTRO */}

      {screen === "register" && (
        <section className="form-screen">

          <div className="moon-logo">
            MOON
          </div>

          <h1>
            Criar conta
          </h1>

          <p className="form-subtitle">
            Encontre pessoas. Faça conexões.
            Viva do seu jeito.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
          >

            <input
              type="text"
              name="name"
              placeholder="Nome ou apelido"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="date"
              name="birthDate"
              value={
                form.birthDate
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              minLength="6"
              required
            />

            <label className="terms">

              <input
                type="checkbox"
                name="terms"
                checked={
                  form.terms
                }
                onChange={
                  handleChange
                }
              />

              <span>
                Eu concordo com os Termos
                e a Política de Privacidade.
              </span>

            </label>

            <button
              type="submit"
              disabled={
                loading
              }
            >
              {loading
                ? "CRIANDO..."
                : "CREATE ACCOUNT"}
            </button>

          </form>

          {message && (
            <p className="form-subtitle">
              {message}
            </p>
          )}

          <button
            className="back-button"
            onClick={() => {
              setScreen(
                "home"
              );

              setMessage("");
            }}
          >
            VOLTAR
          </button>

        </section>
      )}

      {/* LOGIN */}

      {screen === "login" && (
        <section className="form-screen">

          <div className="moon-logo">
            MOON
          </div>

          <h1>
            Bem-vindo de volta
          </h1>

          <p className="form-subtitle">
            Entre na sua noite.
          </p>

          <form
            onSubmit={
              handleLogin
            }
          >

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={
                loginForm.email
              }
              onChange={
                handleLoginChange
              }
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={
                loginForm.password
              }
              onChange={
                handleLoginChange
              }
              required
            />

            <button
              type="submit"
              disabled={
                loading
              }
            >
              {loading
                ? "ENTRANDO..."
                : "ENTER"}
            </button>

          </form>

          {message && (
            <p className="form-subtitle">
              {message}
            </p>
          )}

          <button
            className="back-button"
            onClick={() => {
              setScreen(
                "home"
              );

              setMessage("");
            }}
          >
            VOLTAR
          </button>

        </section>
      )}

      {/* PERFIL */}

      {screen === "profile" && (
        <section className="form-screen">

          <div className="moon-logo">
            MOON
          </div>

          <h1>
            Complete seu perfil
          </h1>

          <p className="form-subtitle">
            Conte um pouco sobre você.
          </p>

          {/* FOTOS */}

          <div className="photo-section">

            <p className="photo-counter">
              FOTOS{" "}
              {photos.length}/5
            </p>

            <div className="photo-grid">

              {photos.map(
                (photo) => (
                  <div
                    key={
                      photo.id
                    }
                    className="photo-card"
                  >

                    <img
                      src={
                        photo.publicUrl
                      }
                      alt="Foto de perfil"
                    />

                    {photo.is_primary && (
                      <span className="primary-label">
                        PRINCIPAL
                      </span>
                    )}

                    <button
                      type="button"
                      className="photo-star"
                      onClick={() =>
                        handleSetPrimary(
                          photo.id
                        )
                      }
                      disabled={
                        photoLoading ||
                        photo.is_primary
                      }
                    >
                      ★
                    </button>

                    <button
                      type="button"
                      className="photo-delete"
                      onClick={() =>
                        handleDeletePhoto(
                          photo
                        )
                      }
                      disabled={
                        photoLoading
                      }
                    >
                      ×
                    </button>

                  </div>
                )
              )}

            </div>

            {photos.length <
              5 && (
              <>

                <label className="moon-upload">

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handlePhotoChange
                    }
                  />

                  <span className="moon-upload-icon">
                    ＋
                  </span>

                  <span className="moon-upload-text">
                    {photoFile
                      ? photoFile.name
                      : "ADICIONAR FOTO"}
                  </span>

                  <span className="moon-upload-subtext">
                    JPG, PNG ou WEBP · até 10 MB
                  </span>

                </label>

                {photoFile && (
                  <button
                    type="button"
                    onClick={
                      handlePhotoUpload
                    }
                    disabled={
                      photoLoading
                    }
                  >
                    {photoLoading
                      ? "ENVIANDO..."
                      : "CONFIRMAR FOTO"}
                  </button>
                )}

              </>
            )}

          </div>

          {/* LOCALIZAÇÃO */}

          <div
            className="photo-section"
            style={{
              marginTop:
                "10px",
              marginBottom:
                "25px",
            }}
          >

            <p className="photo-counter">
              LOCALIZAÇÃO
            </p>

            <p
              className="form-subtitle"
              style={{
                marginTop: "0",
                marginBottom:
                  "15px",
              }}
            >
              A MOON usa sua localização
              para encontrar pessoas próximas.
            </p>

            <button
              type="button"
              onClick={
                handleUseLocation
              }
              disabled={
                locationLoading
              }
            >
              {locationLoading
                ? "LOCALIZANDO..."
                : locationSaved
                ? "ATUALIZAR LOCALIZAÇÃO"
                : "USAR MINHA LOCALIZAÇÃO"}
            </button>

            {locationSaved && (
              <p
                className="form-subtitle"
                style={{
                  marginTop:
                    "12px",
                  marginBottom:
                    "0",
                  color:
                    "#c9b58a",
                }}
              >
                ✓ Localização salva
              </p>
            )}

          </div>

          {/* DADOS */}

          <form
            onSubmit={
              handleProfileSubmit
            }
          >

            <input
              type="text"
              name="city"
              placeholder="Cidade"
              value={
                profileForm.city
              }
              onChange={
                handleProfileChange
              }
              required
            />

            <input
              type="text"
              name="gender"
              placeholder="Gênero"
              value={
                profileForm.gender
              }
              onChange={
                handleProfileChange
              }
              required
            />

            <input
              type="text"
              name="sexuality"
              placeholder="Sexualidade"
              value={
                profileForm.sexuality
              }
              onChange={
                handleProfileChange
              }
              required
            />

            <input
              type="text"
              name="position"
              placeholder="Posição"
              value={
                profileForm.position
              }
              onChange={
                handleProfileChange
              }
            />

            <input
              type="text"
              name="availability"
              placeholder="Disponibilidade"
              value={
                profileForm.availability
              }
              onChange={
                handleProfileChange
              }
            />

            <input
              type="text"
              name="bio"
              placeholder="Conte um pouco sobre você"
              value={
                profileForm.bio
              }
              onChange={
                handleProfileChange
              }
            />

            <button
              type="submit"
              disabled={
                loading
              }
            >
              {loading
                ? "SALVANDO..."
                : "CONTINUAR"}
            </button>

          </form>

          {message && (
            <p className="form-subtitle">
              {message}
            </p>
          )}

        </section>
      )}

      {/* DISCOVERY */}

      {screen === "inside" && (
        <section
          style={{
            width:
              "100%",
            maxWidth:
              "1000px",
            minHeight:
              "100vh",
            padding:
              "35px 20px",
          }}
        >

          {/* HEADER */}

          <div
            style={{
              textAlign:
                "center",
              marginBottom:
                "35px",
            }}
          >

            <div className="moon-logo">
              MOON
            </div>

            <p className="moon-tagline">
              FIND YOUR NIGHT.
            </p>

            <p
              style={{
                color:
                  "#77736b",
                fontSize:
                  "11px",
                letterSpacing:
                  "2px",
                marginTop:
                  "20px",
              }}
            >
              PESSOAS PRÓXIMAS
            </p>

          </div>

          {/* AÇÕES */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              gap:
                "10px",
              marginBottom:
                "30px",
              flexWrap:
                "wrap",
            }}
          >

            <button
              type="button"
              onClick={
                refreshDiscovery
              }
              disabled={
                discoveryLoading
              }
              style={{
                minWidth:
                  "190px",
                height:
                  "44px",
                border:
                  "1px solid #c9b58a",
                background:
                  "transparent",
                color:
                  "#f4ead7",
                letterSpacing:
                  "2px",
                fontSize:
                  "10px",
                cursor:
                  "pointer",
              }}
            >
              {discoveryLoading
                ? "ATUALIZANDO..."
                : "ATUALIZAR DISCOVERY"}
            </button>

            <button
              type="button"
              onClick={
                handleUseLocation
              }
              disabled={
                locationLoading
              }
              style={{
                minWidth:
                  "190px",
                height:
                  "44px",
                border:
                  "1px solid #292929",
                background:
                  "#0b0b0b",
                color:
                  "#c9b58a",
                letterSpacing:
                  "2px",
                fontSize:
                  "10px",
                cursor:
                  "pointer",
              }}
            >
              {locationLoading
                ? "LOCALIZANDO..."
                : "ATUALIZAR LOCALIZAÇÃO"}
            </button>

          </div>

          {/* RESULTADOS */}

          {discoveryLoading ? (
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "70px 20px",
                color:
                  "#77736b",
                letterSpacing:
                  "2px",
                fontSize:
                  "11px",
              }}
            >
              PROCURANDO PESSOAS...
            </div>
          ) : nearbyProfiles.length ===
            0 ? (

            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "70px 20px",
                border:
                  "1px solid #191919",
                background:
                  "#0b0b0b",
              }}
            >

              <p
                style={{
                  color:
                    "#f4ead7",
                  fontSize:
                    "18px",
                  letterSpacing:
                    "3px",
                  marginBottom:
                    "15px",
                }}
              >
                NADA POR AQUI
              </p>

              <p
                style={{
                  color:
                    "#77736b",
                  fontSize:
                    "12px",
                  lineHeight:
                    "1.7",
                  maxWidth:
                    "400px",
                  margin:
                    "0 auto",
                }}
              >
                Ainda não encontramos
                pessoas próximas de você.
                Quando alguém entrar na
                sua região, ela aparecerá aqui.
              </p>

            </div>

          ) : (

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(220px, 1fr))",
                gap:
                  "18px",
              }}
            >

              {nearbyProfiles.map(
                (profile) => {

                  const status =
                    getOnlineStatus(
                      profile.last_active_at
                    );

                  return (
                    <article
                      key={
                        profile.id
                      }
                      style={{
                        background:
                          "#0b0b0b",
                        border:
                          "1px solid #202020",
                        overflow:
                          "hidden",
                        cursor:
                          "pointer",
                        transition:
                          "border-color 0.25s ease",
                      }}
                    >

                      {/* FOTO */}

                      <div
                        style={{
                          width:
                            "100%",
                          aspectRatio:
                            "1 / 1",
                          background:
                            "#101010",
                          position:
                            "relative",
                          overflow:
                            "hidden",
                        }}
                      >

                        {profile.photoUrl ? (

                          <img
                            src={
                              profile.photoUrl
                            }
                            alt={
                              profile.name ||
                              "Perfil MOON"
                            }
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              objectFit:
                                "cover",
                              display:
                                "block",
                            }}
                          />

                        ) : (

                          <div
                            style={{
                              width:
                                "100%",
                              height:
                                "100%",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              color:
                                "#3b3832",
                              fontSize:
                                "45px",
                              letterSpacing:
                                "5px",
                            }}
                          >
                            MOON
                          </div>

                        )}

                        {status && (
                          <span
                            style={{
                              position:
                                "absolute",
                              left:
                                "10px",
                              bottom:
                                "10px",
                              background:
                                "#050505",
                              border:
                                "1px solid #c9b58a",
                              color:
                                "#c9b58a",
                              padding:
                                "5px 8px",
                              fontSize:
                                "8px",
                              letterSpacing:
                                "1.5px",
                            }}
                          >
                            {status}
                          </span>
                        )}

                      </div>

                      {/* INFORMAÇÕES */}

                      <div
                        style={{
                          padding:
                            "16px",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            gap:
                              "10px",
                            marginBottom:
                              "8px",
                          }}
                        >

                          <h2
                            style={{
                              margin:
                                "0",
                              color:
                                "#f4ead7",
                              fontSize:
                                "17px",
                              fontWeight:
                                "400",
                              letterSpacing:
                                "1px",
                            }}
                          >
                            {profile.name ||
                              "Sem nome"}
                            {profile.birth_date &&
                              `, ${calculateAge(
                                profile.birth_date
                              )}`}
                          </h2>

                          <span
                            style={{
                              color:
                                "#c9b58a",
                              fontSize:
                                "10px",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatDistance(
                              profile.distance_km
                            )}
                          </span>

                        </div>

                        {profile.city && (
                          <p
                            style={{
                              margin:
                                "0 0 8px",
                              color:
                                "#77736b",
                              fontSize:
                                "10px",
                              letterSpacing:
                                "1px",
                            }}
                          >
                            {profile.city}
                          </p>
                        )}

                        {profile.bio && (
                          <p
                            style={{
                              margin:
                                "10px 0 0",
                              color:
                                "#8e877c",
                              fontSize:
                                "11px",
                              lineHeight:
                                "1.5",
                              display:
                                "-webkit-box",
                              WebkitLineClamp:
                                2,
                              WebkitBoxOrient:
                                "vertical",
                              overflow:
                                "hidden",
                            }}
                          >
                            {profile.bio}
                          </p>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleLike(profile.id)
                          }
                          style={{
                            width: "100%",
                            height: "42px",
                            marginTop: "14px",
                            border: "1px solid #c9b58a",
                            background: "transparent",
                            color: "#f4ead7",
                            cursor: "pointer",
                            fontSize: "18px",
                            letterSpacing: "2px",
                            transition: "all 0.25s ease",
                          }}
                          onMouseEnter={(event) => {
                            event.currentTarget.style.background =
                              "#c9b58a";
                            event.currentTarget.style.color =
                              "#050505";
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.background =
                              "transparent";
                            event.currentTarget.style.color =
                              "#f4ead7";
                          }}
                          aria-label={`Curtir ${
                            profile.name || "perfil"
                          }`}
                          title="Curtir perfil"
                        >
                          ♥
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

          {message && (
            <p
              style={{
                textAlign:
                  "center",
                color:
                  "#c9b58a",
                fontSize:
                  "11px",
                marginTop:
                  "25px",
              }}
            >
              {message}
            </p>
          )}

          {/* SAIR */}

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "center",
              marginTop:
                "45px",
            }}
          >

            <button
              className="back-button"
              onClick={
                handleLogout
              }
            >
              SAIR
            </button>

          </div>

        </section>
      )}

    </main>
  );
}

export default App;