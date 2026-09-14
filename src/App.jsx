import { useEffect, useRef, useState } from "react";
import { Payment, initMercadoPago } from "@mercadopago/sdk-react";
import { supabase } from "./supabase";
import "./App.css";

const mercadoPagoPublicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

if (mercadoPagoPublicKey) {
  initMercadoPago(mercadoPagoPublicKey, {
    locale: "pt-BR",
  });
}

function App() {
  const [screen, setScreen] = useState("home");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);
  const [message, setMessage] = useState("");

  const [toast, setToast] = useState(null);
const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);
  const [notificationCount, setNotificationCount] = useState({
    like: 0,
    message: 0,
  });
  const [notifications, setNotifications] = useState([]);
  const toastTimeoutRef = useRef(null);
  const processedNotificationIdsRef = useRef(new Set());

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

  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileBirthDate, setProfileBirthDate] = useState("");
  const [profileEditMode, setProfileEditMode] = useState(false);

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
  const [activeAdvertisements, setActiveAdvertisements] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showIdentityFilter, setShowIdentityFilter] = useState(false);
  const [showSexualityFilter, setShowSexualityFilter] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(65);
  const [identityFilter, setIdentityFilter] = useState("");
  const [sexualityFilter, setSexualityFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [showPositionFilter, setShowPositionFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [showAvailabilityFilter, setShowAvailabilityFilter] = useState(false);

  const [chatTarget, setChatTarget] = useState(null);
  const [chatConversation, setChatConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const chatMessagesContainerRef = useRef(null);
const chatMessagesBottomRef = useRef(null);
  const [chatLoading, setChatLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [adminReports, setAdminReports] = useState([]);
  const [adminReportsLoading, setAdminReportsLoading] = useState(false);
  const [adminActionReportId, setAdminActionReportId] = useState(null);
  const [adminAction, setAdminAction] = useState("");
  const [adminActionNote, setAdminActionNote] = useState("");
  const [adminActionLoading, setAdminActionLoading] = useState(false);

  const [advertisements, setAdvertisements] = useState([]);
  const [advertisementsLoading, setAdvertisementsLoading] = useState(false);
  const [showAdvertisementForm, setShowAdvertisementForm] = useState(false);
  const [advertisementSaving, setAdvertisementSaving] = useState(false);
  const [advertisementImageFile, setAdvertisementImageFile] = useState(null);
  const [advertisementForm, setAdvertisementForm] = useState({
    company_name: "",
    title: "",
    description: "",
    destination_url: "",
    cta_text: "SAIBA MAIS",
    starts_at: "",
    ends_at: "",
    is_active: false,
    display_frequency: 8,
  });

  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [likesLoading, setLikesLoading] = useState(false);
  const [chatOrigin, setChatOrigin] = useState("inside");
  const [reportTarget, setReportTarget] = useState(null);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showSelectedProfileMenu, setShowSelectedProfileMenu] = useState(false);
  const [legalPage, setLegalPage] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockedUsersLoading, setBlockedUsersLoading] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedProfilePhotos, setSelectedProfilePhotos] = useState([]);
  const [selectedProfileLoading, setSelectedProfileLoading] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
  const [selectedBoostHours, setSelectedBoostHours] = useState(3);
  const [boostPaymentOpen, setBoostPaymentOpen] = useState(false);
  const [boostPaymentLoading, setBoostPaymentLoading] = useState(false);
  const [boostPaymentSubmitted, setBoostPaymentSubmitted] = useState(false);
  const [boostPaymentId, setBoostPaymentId] = useState(null);
  const [boostPaymentAmount, setBoostPaymentAmount] = useState(8);
  const [boostPaymentEmail, setBoostPaymentEmail] = useState("");
  const [boostPaymentStatus, setBoostPaymentStatus] = useState("");
  const [boostPaymentResult, setBoostPaymentResult] = useState(null);
  const [activeBoost, setActiveBoost] = useState(null);
  const [boostSecondsLeft, setBoostSecondsLeft] = useState(0);

  const notificationAudioContextRef = useRef(null);

  function unlockNotificationAudio() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!notificationAudioContextRef.current) {
        notificationAudioContextRef.current = new AudioContextClass();
      }

      if (notificationAudioContextRef.current.state === "suspended") {
        notificationAudioContextRef.current.resume().catch(() => {});
      }
    } catch (error) {
      console.warn("NÃO FOI POSSÍVEL LIBERAR O ÁUDIO:", error);
    }
  }

  function playNotificationSound() {
  if (!notificationSoundEnabled) {
    return;
  }

    try {
      const audioContext = notificationAudioContextRef.current;

      if (!audioContext || audioContext.state !== "running") {
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(740, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        520,
        audioContext.currentTime + 0.12
      );

      gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.045,
        audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + 0.14
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15);

      oscillator.addEventListener("ended", () => {
        oscillator.disconnect();
        gainNode.disconnect();
      });
    } catch (error) {
      console.warn("NÃO FOI POSSÍVEL REPRODUZIR O SOM:", error);
    }
  }

  function showToast({ icon = "✦", title = "", body = "" }) {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({
      id: Date.now(),
      icon,
      title,
      body,
    });

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3800);
  }

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);


  useEffect(() => {
    const unlockAudio = () => {
      unlockNotificationAudio();
    };

    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setNotifications([]);
      setNotificationCount({ like: 0, message: 0 });
      processedNotificationIdsRef.current = new Set();
      return;
    }

    let isMounted = true;

    async function startNotificationRealtime() {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("id, user_id, actor_id, type, like_id, message_id, read_at, created_at, is_read")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        if (!isMounted) return;

        const rows = data || [];
        setNotifications(rows);
        processedNotificationIdsRef.current = new Set(rows.map((item) => item.id));

        const unreadCounts = rows.reduce(
          (accumulator, item) => {
            if (!item.is_read && (item.type === "like" || item.type === "message")) {
              accumulator[item.type] += 1;
            }
            return accumulator;
          },
          { like: 0, message: 0 }
        );

        setNotificationCount(unreadCounts);
      } catch (error) {
        console.error("ERRO AO CARREGAR NOTIFICACOES:", error);
      }
    }

    startNotificationRealtime();

    const channel = supabase
      .channel(`moon-notifications-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${currentUserId}`,
        },
        (payload) => {
          const notification = payload.new;

          if (!notification?.id) return;
          if (processedNotificationIdsRef.current.has(notification.id)) return;

          processedNotificationIdsRef.current.add(notification.id);

          setNotifications((current) => [notification, ...current].slice(0, 100));

          if (notification.type === "like" || notification.type === "message") {
            setNotificationCount((current) => ({
              ...current,
              [notification.type]: current[notification.type] + (notification.is_read ? 0 : 1),
            }));
          }

          if (notification.type === "like") {
            playNotificationSound();
          showToast({
              icon: "❤️",
              title: notification.title || "Nova curtida",
              body: notification.body || "Alguém curtiu você.",
            });
          } else if (notification.type === "message") {
          playNotificationSound();
            showToast({
              icon: "💬",
              title: notification.title || "Nova mensagem",
              body: notification.body || "Você recebeu uma nova mensagem.",
            });
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [currentUserId, notificationSoundEnabled]);

  async function loadActiveBoost() {
    if (!currentUserId) {
      setActiveBoost(null);
      setBoostSecondsLeft(0);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("boosts")
        .select("id, plan_hours, amount, status, starts_at, ends_at")
        .eq("user_id", currentUserId)
        .eq("status", "active")
        .lte("starts_at", new Date().toISOString())
        .gt("ends_at", new Date().toISOString())
        .order("ends_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setActiveBoost(null);
        setBoostSecondsLeft(0);
        return;
      }

      setActiveBoost(data);
      setBoostSecondsLeft(Math.max(0, Math.floor((new Date(data.ends_at).getTime() - Date.now()) / 1000)));
    } catch (error) {
      console.error("ERRO AO CARREGAR BOOST ATIVO:", error);
    }
  }

  function formatBoostTime(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  }

  async function handleCreateBoost() {
    setMessage("");

    const prices = {
      1: 5.00,
      3: 8.00,
      5: 10.00,
    };

    const amount = prices[selectedBoostHours];

    if (!mercadoPagoPublicKey) {
      setMessage("A chave pública do Mercado Pago não foi configurada.");
      return;
    }

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Sua sessão expirou. Entre novamente para continuar.");
        return;
      }

      const { data: boost, error } = await supabase
        .from("boosts")
        .insert({
          user_id: user.id,
          plan_hours: selectedBoostHours,
          amount,
          status: "pending",
        })
        .select("id, plan_hours, amount, status")
        .single();

      if (error || !boost) {
        console.error("ERRO AO REGISTRAR BOOST:", error);
        setMessage("Não foi possível registrar o Boost agora.");
        return;
      }

      setBoostPaymentId(boost.id);
      setBoostPaymentAmount(Number(boost.amount));
      setBoostPaymentEmail(user.email || "");
      setBoostPaymentSubmitted(false);
      setBoostPaymentStatus("");
      setBoostPaymentResult(null);
      setBoostOpen(false);
      setBoostPaymentOpen(true);
    } catch (error) {
      console.error("ERRO AO CRIAR BOOST:", error);
      setMessage("Não foi possível iniciar o pagamento do Boost.");
    }
  }

  async function handleBoostPaymentSubmit({ selectedPaymentMethod, formData }) {
    if (!boostPaymentId) {
      throw new Error("Boost não encontrado.");
    }

    setBoostPaymentLoading(true);
    setBoostPaymentSubmitted(true);
    setBoostPaymentStatus("PROCESSANDO PAGAMENTO...");
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-mp-payment",
        {
          body: {
            boost_id: boostPaymentId,
            selected_payment_method: selectedPaymentMethod,
            formData,
          },
        }
      );

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "Não foi possível processar o pagamento."
        );
      }

      setBoostPaymentResult(data);

      if (
        data.order_status === "processed" ||
        data.payment_status === "processed" ||
        data.payment_status === "approved"
      ) {
        setBoostPaymentStatus("PAGAMENTO APROVADO. ATIVANDO BOOST...");
        setTimeout(() => loadActiveBoost(), 1000);
      } else if (
        data.pix?.qr_code ||
        data.pix?.qr_code_base64
      ) {
        setBoostPaymentStatus("PIX GERADO. PAGUE PARA ATIVAR O BOOST.");
      } else {
        setBoostPaymentStatus("PAGAMENTO ENVIADO. AGUARDANDO CONFIRMAÇÃO...");
      }

      return;
    } catch (error) {
      console.error("ERRO AO PROCESSAR PAGAMENTO DO BOOST:", error);
      setBoostPaymentSubmitted(false);
      setBoostPaymentStatus("");
      throw error;
    } finally {
      setBoostPaymentLoading(false);
    }
  }

  async function refreshBoostPaymentStatus() {
    if (!boostPaymentId) return;

    const { data, error } = await supabase
      .from("boosts")
      .select("status, starts_at, ends_at, plan_hours, amount")
      .eq("id", boostPaymentId)
      .maybeSingle();

    if (error) {
      console.error("ERRO AO CONSULTAR STATUS DO BOOST:", error);
      return;
    }

    if (!data) return;

    if (data.status === "active") {
      if (boostPaymentResult?.boost_status !== "active") {
        showToast({
          icon: "⚡",
          title: "Boost ativado",
          body: "Seu perfil já está em destaque.",
        });
      }

      setBoostPaymentStatus("BOOST ATIVO. Seu perfil já está em destaque. ⚡");
      setBoostPaymentResult((current) => ({
        ...(current || {}),
        boost_status: "active",
        starts_at: data.starts_at,
        ends_at: data.ends_at,
      }));
    } else if (data.status === "expired") {
      setBoostPaymentStatus("Este Boost expirou.");
    } else if (data.status === "cancelled") {
      setBoostPaymentStatus("Este Boost foi cancelado.");
    }
  }

  useEffect(() => {
    if (!boostPaymentOpen || !boostPaymentSubmitted || !boostPaymentId) {
      return;
    }

    refreshBoostPaymentStatus();

    const interval = setInterval(() => {
      refreshBoostPaymentStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [boostPaymentOpen, boostPaymentSubmitted, boostPaymentId]);

  useEffect(() => {
    if (!currentUserId) return;

    loadActiveBoost();

    const interval = setInterval(() => {
      loadActiveBoost();
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUserId]);

  useEffect(() => {
    if (!activeBoost?.ends_at) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(activeBoost.ends_at).getTime() - Date.now()) / 1000));
      setBoostSecondsLeft(remaining);

      if (remaining <= 0) {
        setActiveBoost(null);
        loadActiveBoost();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeBoost?.ends_at]);

  useEffect(() => {
    if (screen === "settings") {
      loadBlockedUsers();
    }
  }, [screen]);

  useEffect(() => {
    if (screen !== "admin" || !isAdmin) {
      return;
    }

    const interval = setInterval(() => {
      loadAdminStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [screen, isAdmin]);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const isRecoveryUrl = hashParams.get("type") === "recovery";

    async function checkSession() {
      if (isRecoveryUrl) {
        setScreen("resetPassword");
        setResetPasswordForm({
          newPassword: "",
          confirmPassword: "",
        });
        setMessage("");
        setCheckingSession(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setCurrentUserId(data.session.user.id);
        setProfileEditMode(false);
        setAgeVerified(true);
        await checkAdminStatus();
        await loadProfile(data.session.user.id);
      } else {
        setScreen("ageGate");
      }

      setCheckingSession(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setScreen("resetPassword");
          setResetPasswordForm({
            newPassword: "",
            confirmPassword: "",
          });
          setMessage("");
          return;
        }

        if (session && !isRecoveryUrl) {
          setCurrentUserId(session.user.id);
          setProfileEditMode(false);
          await checkAdminStatus();
          await loadProfile(session.user.id);
        }
      }
    );

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (screen !== "chat" || !chatConversation?.id) {
      return;
    }

    const conversationId = chatConversation.id;

    async function startChatRealtime() {
      await loadMessages(conversationId);
    }

    startChatRealtime();

    const channel = supabase
      .channel(`moon-chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setChatMessages((currentMessages) => {
            const alreadyExists = currentMessages.some(
              (item) => item.id === payload.new.id
            );

            if (alreadyExists) {
              return currentMessages;
            }

            return [...currentMessages, payload.new];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setChatMessages((currentMessages) =>
            currentMessages.map((item) =>
              item.id === payload.new.id ? { ...item, ...payload.new } : item
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [screen, chatConversation?.id, readReceiptsEnabled, currentUserId]);

useEffect(() => {
  if (screen !== "chat" || !chatConversation?.id || chatMessages.length === 0) {
    return;
  }

  const scrollToBottom = () => {
    chatMessagesBottomRef.current?.scrollIntoView({
      block: "end",
      behavior: "auto",
    });
  };

  scrollToBottom();

  const frame = requestAnimationFrame(scrollToBottom);

  return () => {
    cancelAnimationFrame(frame);
  };
}, [screen, chatConversation?.id, chatMessages.length]);


  useEffect(() => {
    if (screen !== "chat" || !chatConversation?.id) {
      return;
    }
  }, [screen, chatConversation?.id, chatMessages.length]);

  useEffect(() => {
    if (screen !== "conversations" || !currentUserId) {
      return;
    }

    const channel = supabase
      .channel(`moon-conversations-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        async () => {
          await loadConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const newMessage = payload.new;

          if (!newMessage?.id || !newMessage?.conversation_id) {
            return;
          }

          setConversations((currentConversations) => {
            const updatedConversations = currentConversations.map((conversation) =>
              conversation.id === newMessage.conversation_id
                ? {
                    ...conversation,
                    lastMessage: {
                      content: newMessage.content,
                      created_at: newMessage.created_at,
                      sender_id: newMessage.sender_id,
                    },
                  }
                : conversation
            );

            return [...updatedConversations].sort((a, b) => {
              const dateA = new Date(a.lastMessage?.created_at || a.created_at || 0).getTime();
              const dateB = new Date(b.lastMessage?.created_at || b.created_at || 0).getTime();

              return dateB - dateA;
            });
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [screen, currentUserId]);

  async function checkAdminStatus() {
    try {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) { console.error("ERRO AO VERIFICAR ADMIN:", error); setIsAdmin(false); return false; }
      const admin = data === true;
      setIsAdmin(admin);
      return admin;
    } catch (error) { console.error("ERRO AO VERIFICAR ADMIN:", error); setIsAdmin(false); return false; }
  }

  async function loadAdminReports() {
    if (!isAdmin) return;

    setAdminReportsLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.rpc("get_admin_reports");

      if (error) throw error;

      const reports = data || [];
      const userIds = [...new Set(
        reports.flatMap((report) => [report.reporter_id, report.reported_user_id]).filter(Boolean)
      )];

      let profiles = [];

      if (userIds.length) {
        const { data: profileRows, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, birth_date, moderation_status")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        profiles = profileRows || [];
      }

      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

      const pendingCounts = reports.reduce((counts, report) => {
        if (report.status === "pending" && report.reported_user_id) {
          counts[report.reported_user_id] = (counts[report.reported_user_id] || 0) + 1;
        }
        return counts;
      }, {});

      setAdminReports(
        reports.map((report) => ({
          ...report,
          reporter: profileMap.get(report.reporter_id) || null,
          reported: profileMap.get(report.reported_user_id) || null,
          pendingReportCount: pendingCounts[report.reported_user_id] || 0,
        }))
      );
    } catch (error) {
      console.error("ERRO AO CARREGAR DENÚNCIAS:", error);
      setMessage(error.message || "Não foi possível carregar as denúncias.");
    } finally {
      setAdminReportsLoading(false);
    }
  }

  async function enforceCurrentUserStatus() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        return true;
      }

      const { data, error } = await supabase.functions.invoke(
        "enforce-user-status",
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (error) {
        console.error("ERRO AO VERIFICAR STATUS DA CONTA:", error);
        return true;
      }

      if (data?.allowed === false && data?.reason === "banned") {
        await supabase.auth.signOut();
        setCurrentUserId(null);
        setAgeVerified(false);
        setProfile(null);
        setScreen("login");
        setMessage(data.message || "Esta conta foi banida da MOON.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("ERRO AO VERIFICAR STATUS DA CONTA:", error);
      return true;
    }
  }

  async function loadAdvertisements() {
    if (!isAdmin) return;

    setAdvertisementsLoading(true);

    try {
      const { data, error } = await supabase
        .from("advertisements")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAdvertisements(data || []);
    } catch (error) {
      console.error("ERRO AO CARREGAR PUBLICIDADES:", error);
      setMessage(error.message || "Não foi possível carregar as publicidades.");
    } finally {
      setAdvertisementsLoading(false);
    }
  }

  function resetAdvertisementForm() {
    setAdvertisementForm({
      company_name: "",
      title: "",
      description: "",
      destination_url: "",
      cta_text: "SAIBA MAIS",
      starts_at: "",
      ends_at: "",
      is_active: false,
      display_frequency: 8,
    });
    setAdvertisementImageFile(null);
  }

  async function handleCreateAdvertisement(event) {
    event?.preventDefault();

    if (!advertisementForm.company_name.trim()) {
      setMessage("Informe o nome da empresa.");
      return;
    }

    if (!advertisementForm.title.trim()) {
      setMessage("Informe o título do anúncio.");
      return;
    }

    if (!advertisementImageFile) {
      setMessage("Selecione uma imagem para o anúncio.");
      return;
    }

    if (advertisementForm.destination_url.trim()) {
      try {
        const url = new URL(advertisementForm.destination_url.trim());
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setMessage("Informe um link válido começando com https:// ou http://.");
        return;
      }
    }

    const frequency = Number(advertisementForm.display_frequency);

    if (!Number.isInteger(frequency) || frequency <= 0) {
      setMessage("A frequência deve ser um número maior que zero.");
      return;
    }

    setAdvertisementSaving(true);
    setMessage("");

    try {
      const fileExtension =
        advertisementImageFile.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeCompanyName = advertisementForm.company_name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50);

      const filePath = `admin/${crypto.randomUUID()}-${safeCompanyName || "anuncio"}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("advertisement-images")
        .upload(filePath, advertisementImageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("advertisement-images")
        .getPublicUrl(filePath);

      const { data: newAdvertisementId, error: rpcError } = await supabase.rpc(
        "admin_create_advertisement",
        {
          p_company_name: advertisementForm.company_name.trim(),
          p_title: advertisementForm.title.trim(),
          p_description: advertisementForm.description.trim() || null,
          p_image_url: publicUrl,
          p_destination_url: advertisementForm.destination_url.trim() || null,
          p_cta_text: advertisementForm.cta_text.trim() || "SAIBA MAIS",
          p_starts_at: advertisementForm.starts_at
            ? new Date(advertisementForm.starts_at).toISOString()
            : new Date().toISOString(),
          p_ends_at: advertisementForm.ends_at
            ? new Date(advertisementForm.ends_at).toISOString()
            : null,
          p_is_active: advertisementForm.is_active,
          p_display_frequency: frequency,
        }
      );

      if (rpcError) {
        await supabase.storage.from("advertisement-images").remove([filePath]);
        throw rpcError;
      }

      console.log("PUBLICIDADE CRIADA:", newAdvertisementId);

      resetAdvertisementForm();
      setShowAdvertisementForm(false);
      setMessage("Publicidade criada com sucesso.");
      await loadAdvertisements();
    } catch (error) {
      console.error("ERRO AO CRIAR PUBLICIDADE:", error);
      setMessage(error.message || "Não foi possível criar a publicidade.");
    } finally {
      setAdvertisementSaving(false);
    }
  }

  async function handleToggleAdvertisement(advertisement) {
    if (!advertisement?.id) return;

    try {
      const { error } = await supabase
        .from("advertisements")
        .update({
          is_active: !advertisement.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", advertisement.id);

      if (error) throw error;

      setMessage(
        advertisement.is_active
          ? "Publicidade pausada."
          : "Publicidade ativada."
      );

      await loadAdvertisements();
    } catch (error) {
      console.error("ERRO AO ALTERAR PUBLICIDADE:", error);
      setMessage(error.message || "Não foi possível alterar a publicidade.");
    }
  }

  async function handleDeleteAdvertisement(advertisement) {
    if (!advertisement?.id) return;

    const confirmed = window.confirm(
      `Excluir a publicidade de "${advertisement.company_name}"?`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", advertisement.id);

      if (error) throw error;

      if (advertisement.image_url) {
        try {
          const imageUrl = new URL(advertisement.image_url);
          const marker = "/storage/v1/object/public/advertisement-images/";
          const markerIndex = imageUrl.pathname.indexOf(marker);

          if (markerIndex !== -1) {
            const storagePath = decodeURIComponent(
              imageUrl.pathname.slice(markerIndex + marker.length)
            );

            await supabase.storage
              .from("advertisement-images")
              .remove([storagePath]);
          }
        } catch (storageError) {
          console.warn("NÃO FOI POSSÍVEL REMOVER A IMAGEM:", storageError);
        }
      }

      setMessage("Publicidade excluída.");
      await loadAdvertisements();
    } catch (error) {
      console.error("ERRO AO EXCLUIR PUBLICIDADE:", error);
      setMessage(error.message || "Não foi possível excluir a publicidade.");
    }
  }

  async function handleAdminReview(report) {
    if (!report?.id || !adminAction) {
      setMessage("Selecione uma ação administrativa.");
      return;
    }

    if (adminAction === "suspend" || adminAction === "ban") {
      const actionLabel = adminAction === "suspend" ? "SUSPENDER" : "BANIR";
      const confirmed = window.confirm(
        `Deseja realmente ${actionLabel.toLowerCase()} este perfil?`
      );

      if (!confirmed) return;
    }

    setAdminActionLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.rpc("admin_review_report", {
        target_report_id: report.id,
        action: adminAction,
        note: adminActionNote.trim() || null,
      });

      if (error) throw error;

      setAdminActionReportId(null);
      setAdminAction("");
      setAdminActionNote("");
      setMessage("Ação administrativa registrada com sucesso.");

      await loadAdminReports();
      await loadAdminStats();
    } catch (error) {
      console.error("ERRO AO APLICAR AÇÃO ADMINISTRATIVA:", error);
      setMessage(error.message || "Não foi possível aplicar a ação administrativa.");
    } finally {
      setAdminActionLoading(false);
    }
  }

  async function loadAdminStats() {
    if (!isAdmin) return;
    setAdminLoading(true);
    setMessage("");
    try {
      const [users, active, likes, conversations, messages, boosts, reports, blocks] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("likes").select("id", { count: "exact", head: true }),
        supabase.from("conversations").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("boosts").select("id, amount, status"),
        supabase.from("reports").select("id", { count: "exact", head: true }),
        supabase.from("blocked_users").select("id", { count: "exact", head: true }),
      ]);
      const err = [users, active, likes, conversations, messages, boosts, reports, blocks].find(r => r.error)?.error;
      if (err) throw err;
      const boostRows = boosts.data || [];
      const paid = boostRows.filter(b => ["active", "expired"].includes(b.status));
      setAdminStats({ totalUsers: users.count || 0, activeUsers: active.count || 0, likes: likes.count || 0, conversations: conversations.count || 0, messages: messages.count || 0, boosts: boostRows.length, activeBoosts: boostRows.filter(b => b.status === "active").length, reports: reports.count || 0, blocks: blocks.count || 0, revenue: paid.reduce((sum,b) => sum + Number(b.amount || 0), 0) });
    } catch (error) { console.error("ERRO AO CARREGAR PAINEL ADMIN:", error); setMessage(error.message || "Não foi possível carregar o painel administrativo."); }
    finally { setAdminLoading(false); }
  }

  async function openAdminPanel() {
    const admin = await checkAdminStatus();
    if (!admin) { setMessage("Acesso restrito."); return; }
    setScreen("admin");
    await loadAdminStats();
  }

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

    setProfileDisplayName(data.name || "");
    setProfileBirthDate(data.birth_date || "");
    setReadReceiptsEnabled(data.read_receipts_enabled !== false);

    setProfileForm({
      city: "",
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
      data.gender &&
      data.sexuality &&
      data.position &&
      data.availability &&
      hasLocation
    ) {
      setProfileEditMode(false);
      setScreen("profile");

      await loadNearbyProfiles(
        data.latitude,
        data.longitude
      );
    } else {
      setProfileEditMode(true);
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

  async function openProfileDetails(profile) {
    setSelectedProfile(profile);
    setShowSelectedProfileMenu(false);
    setSelectedProfilePhotos([]);
    setSelectedProfileLoading(true);

    const { data, error } = await supabase
      .from("profile_photos")
      .select("id, storage_path, is_primary")
      .eq("user_id", profile.id)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });

    if (!error) {
      const photosWithUrl = (data || []).map((photo) => {
        const { data: publicData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(photo.storage_path);

        return { ...photo, publicUrl: publicData.publicUrl };
      });

      setSelectedProfilePhotos(photosWithUrl);
    }

    setSelectedProfileLoading(false);
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

      const profiles = data || [];

      const profileIds = profiles.map((profile) => profile.id);
      let boostedIds = new Set();

      if (profileIds.length > 0) {
        const { data: boostedRows, error: boostedError } = await supabase.rpc(
          "get_active_boosted_profile_ids",
          { p_user_ids: profileIds }
        );

        if (boostedError) throw boostedError;
        boostedIds = new Set((boostedRows || []).map((row) => row.user_id));
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { data: blockedRows, error: blockedError } = await supabase
        .from("blocked_users")
        .select("blocked_user_id")
        .eq("user_id", user?.id);

      if (blockedError) throw blockedError;

      const blockedIds = new Set((blockedRows || []).map((row) => row.blocked_user_id));
      const visibleProfiles = profiles.filter((profile) => !blockedIds.has(profile.id));

      const { data: advertisementData, error: advertisementError } = await supabase
        .from("advertisements")
        .select("id, company_name, title, description, image_url, destination_url, cta_text, display_frequency, starts_at, ends_at")
        .eq("is_active", true)
        .lte("starts_at", new Date().toISOString())
        .or(`ends_at.is.null,ends_at.gte.${new Date().toISOString()}`)
        .order("created_at", { ascending: true });

      if (advertisementError) throw advertisementError;

      setActiveAdvertisements(advertisementData || []);

      const profilesWithPhotos =
        await Promise.all(
          visibleProfiles.map(
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
                  is_boosted: boostedIds.has(profile.id),
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
                is_boosted: boostedIds.has(profile.id),
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

          showToast({
            icon: "📍",
            title: "Localização atualizada",
            body: "Sua localização foi atualizada com sucesso.",
          });

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
          0,
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


  async function loadBlockedUsers() {
    setBlockedUsersLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("blocked_users")
        .select("blocked_user_id")
        .eq("user_id", user.id);

      if (error) throw error;

      const blockedIds = (data || []).map((row) => row.blocked_user_id);

      if (!blockedIds.length) {
        setBlockedUsers([]);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, birth_date")
        .in("id", blockedIds);

      if (profilesError) throw profilesError;

      const orderedProfiles = blockedIds
        .map((id) => (profiles || []).find((profile) => profile.id === id))
        .filter(Boolean);

      setBlockedUsers(orderedProfiles);
    } catch (error) {
      console.error("ERRO AO CARREGAR BLOQUEADOS:", error);
      setMessage("Não foi possível carregar os usuários bloqueados.");
    } finally {
      setBlockedUsersLoading(false);
    }
  }

  async function handleUnblock(profile) {
    if (!profile?.id) return;

    const confirmUnblock = window.confirm(
      `Deseja desbloquear ${profile?.name || "este usuário"}?`
    );

    if (!confirmUnblock) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado.");

      const { error } = await supabase
        .from("blocked_users")
        .delete()
        .eq("user_id", user.id)
        .eq("blocked_user_id", profile.id);

      if (error) throw error;

      setBlockedUsers((current) => current.filter((item) => item.id !== profile.id));
      showToast({ icon: "↩", title: "Usuário desbloqueado", body: "O perfil foi desbloqueado." });
      await loadNearbyProfiles(userLocation.latitude, userLocation.longitude);
    } catch (error) {
      console.error("ERRO AO DESBLOQUEAR USUÁRIO:", error);
      setMessage(error.message || "Não foi possível desbloquear o usuário.");
    }
  }

  async function handleBlock(profile) {
    const confirmBlock = window.confirm(
      `Deseja realmente bloquear ${profile?.name || "este perfil"}?`
    );

    if (!confirmBlock) return;

    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado.");

      const { error } = await supabase
        .from("blocked_users")
        .insert({ user_id: user.id, blocked_user_id: profile.id });

      if (error && error.code !== "23505") throw error;

      setNearbyProfiles((currentProfiles) =>
        currentProfiles.filter((item) => item.id !== profile.id)
      );
      showToast({ icon: "🚫", title: "Perfil bloqueado", body: "O perfil foi bloqueado." });
    } catch (error) {
      console.error("ERRO AO BLOQUEAR PERFIL:", error);
      setMessage(error.message || "Não foi possível bloquear este perfil.");
    }
  }

  async function handleReport(profile) {
    if (!profile?.id) return;

    if (!reportReason) {
      setMessage("Selecione um motivo para denunciar.");
      return;
    }

    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const { error } = await supabase
        .from("reports")
        .insert({
          reporter_id: user.id,
          reported_user_id: profile.id,
          reason: reportReason,
          description: reportDescription.trim() || null,
        });

      if (error) throw error;

      setReportTarget(null);
      setReportReason("");
      setReportDescription("");
      showToast({ icon: "⚠️", title: "Denúncia enviada", body: "Obrigado por ajudar a manter a MOON segura." });
    } catch (error) {
      console.error("ERRO AO DENUNCIAR PERFIL:", error);
      setMessage(error.message || "Não foi possível enviar a denúncia.");
    }
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
          showToast({
            icon: "❤️",
            title: "Você já curtiu este perfil.",
            body: "Essa curtida já foi registrada.",
          });
          return;
        }

        throw error;
      }

      showToast({
        icon: "❤️",
        title: "Perfil curtido",
        body: "Sua curtida foi enviada.",
      });

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

  async function markConversationAsRead(conversationId) {
    if (!readReceiptsEnabled || !conversationId || !currentUserId) {
      return;
    }

    const readAt = new Date().toISOString();

    const { error } = await supabase
      .from("messages")
      .update({ read_at: readAt })
      .eq("conversation_id", conversationId)
      .neq("sender_id", currentUserId)
      .is("read_at", null);

    if (error) {
      console.error("ERRO AO MARCAR MENSAGENS COMO LIDAS:", error);
      return;
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
            }
          : conversation
      )
    );
  }

  async function loadMessages(conversationId) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "ERRO AO CARREGAR MENSAGENS:",
        error
      );
      return;
    }

    setChatMessages(data || []);
    await markConversationAsRead(conversationId);
  }

  async function loadConversations() {
    setConversationsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      setCurrentUserId(user.id);

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const conversationsWithProfiles =
        await Promise.all(
          (data || []).map(async (conversation) => {
            const otherUserId =
              conversation.user_one_id === user.id
                ? conversation.user_two_id
                : conversation.user_one_id;

            const { data: profile, error: profileError } =
              await supabase
                .from("profiles")
                .select(
                  "id, name, city, birth_date, last_active_at"
                )
                .eq("id", otherUserId)
                .maybeSingle();

            if (profileError || !profile) {
              return null;
            }

            const { data: photoData } = await supabase
              .from("profile_photos")
              .select("storage_path, is_primary")
              .eq("user_id", otherUserId)
              .order("is_primary", {
                ascending: false,
              })
              .order("created_at", {
                ascending: true,
              })
              .limit(1);

            let photoUrl = null;

            if (photoData && photoData.length > 0) {
              const { data: publicData } = supabase.storage
                .from("profile-photos")
                .getPublicUrl(photoData[0].storage_path);

              photoUrl = publicData.publicUrl;
            }

            const { data: lastMessageData } = await supabase
              .from("messages")
              .select("content, created_at, sender_id")
              .eq("conversation_id", conversation.id)
              .order("created_at", {
                ascending: false,
              })
              .limit(1);

            const { count: unreadCount } = await supabase
              .from("messages")
              .select("id", { count: "exact", head: true })
              .eq("conversation_id", conversation.id)
              .neq("sender_id", user.id)
              .is("read_at", null);

            return {
              ...conversation,
              profile,
              photoUrl,
              lastMessage:
                lastMessageData && lastMessageData.length > 0
                  ? lastMessageData[0]
                  : null,
              unreadCount: unreadCount || 0,
            };
          })
        );

      setConversations(
        conversationsWithProfiles.filter(Boolean)
      );
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR CONVERSAS:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível carregar suas conversas."
      );
    } finally {
      setConversationsLoading(false);
    }
  }

  async function loadLikedProfiles() {
    setLikesLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const { data, error } = await supabase
        .from("likes")
        .select("user_id, created_at")
        .eq("liked_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const profiles = await Promise.all(
        (data || []).map(async (like) => {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, name, city, birth_date, last_active_at")
            .eq("id", like.user_id)
            .maybeSingle();

          if (profileError || !profile) {
            return null;
          }

          const { data: photoData } = await supabase
            .from("profile_photos")
            .select("storage_path, is_primary")
            .eq("user_id", profile.id)
            .order("is_primary", { ascending: false })
            .order("created_at", { ascending: true })
            .limit(1);

          let photoUrl = null;

          if (photoData && photoData.length > 0) {
            const { data: publicData } = supabase.storage
              .from("profile-photos")
              .getPublicUrl(photoData[0].storage_path);
            photoUrl = publicData.publicUrl;
          }

          return { ...profile, photoUrl };
        })
      );

      setLikedProfiles(profiles.filter(Boolean));
    } catch (error) {
      console.error("ERRO AO CARREGAR CURTIDAS:", error);
      setMessage(error.message || "Não foi possível carregar suas curtidas.");
    } finally {
      setLikesLoading(false);
    }
  }

  async function markNotificationsAsRead(type) {
    if (!currentUserId || !type) return;

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("user_id", currentUserId)
      .eq("type", type)
      .eq("is_read", false);

    if (error) {
      console.error("ERRO AO MARCAR NOTIFICACOES COMO LIDAS:", error);
      return;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.type === type && !item.is_read
          ? { ...item, is_read: true, read_at: new Date().toISOString() }
          : item
      )
    );

    setNotificationCount((current) => ({
      ...current,
      [type]: 0,
    }));
  }

  async function handleOpenLikes() {
    setMessage("");
    setScreen("likes");
    await markNotificationsAsRead("like");
    await loadLikedProfiles();
  }

  async function handleOpenConversations() {
    setMessage("");
    setScreen("conversations");
    await markNotificationsAsRead("message");
    await loadConversations();
  }

  async function handleChat(profile, origin = "inside") {
    setMessage("");
    setChatLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const firstUserId =
        user.id < profile.id
          ? user.id
          : profile.id;

      const secondUserId =
        user.id < profile.id
          ? profile.id
          : user.id;

      let { data: conversation, error } =
        await supabase
          .from("conversations")
          .select("*")
          .or(
            `and(user_one_id.eq.${firstUserId},user_two_id.eq.${secondUserId}),and(user_one_id.eq.${secondUserId},user_two_id.eq.${firstUserId})`
          )
          .maybeSingle();

      if (error) {
        throw error;
      }

      if (!conversation) {
        const {
          data: newConversation,
          error: createError,
        } = await supabase
          .from("conversations")
          .insert({
            user_one_id: firstUserId,
            user_two_id: secondUserId,
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        conversation = newConversation;
      }

      setCurrentUserId(user.id);
      setChatOrigin(origin);
      setChatTarget(profile);
      setChatConversation(conversation);
      setChatMessages([]);
      setChatText("");
      setScreen("chat");
    } catch (error) {
      console.error(
        "ERRO AO ABRIR CONVERSA:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível abrir a conversa."
      );
    } finally {
      setChatLoading(false);
    }
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = chatText.trim();

    if (!content || !chatConversation?.id) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const { error } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatConversation.id,
          sender_id: user.id,
          content,
        });

      if (error) {
        throw error;
      }

      setChatText("");
      showToast({
        icon: "💬",
        title: "Mensagem enviada",
        body: "Sua mensagem foi enviada.",
      });
    } catch (error) {
      console.error(
        "ERRO AO ENVIAR MENSAGEM:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível enviar a mensagem."
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
      photos.length >= 3
    ) {
      setMessage(
        "Você já possui 3 fotos."
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
      photos.length >= 3
    ) {
      setMessage(
        "Você já possui 3 fotos."
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

  async function handleForgotPassword() {
    if (forgotPasswordLoading) return;

    const email = loginForm.email.trim();

    if (!email) {
      setMessage("Digite seu e-mail para recuperar a senha.");
      return;
    }

    setForgotPasswordLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });

      if (error) {
        throw error;
      }

      setMessage("Enviamos um link para redefinir sua senha. Verifique seu e-mail.");
    } catch (error) {
      console.error("ERRO AO RECUPERAR SENHA:", error);
      setMessage(error.message || "Não foi possível enviar o link de recuperação.");
    } finally {
      setForgotPasswordLoading(false);
    }
  }

  async function handleResetPassword() {
    if (resetPasswordLoading) return;

    const newPassword = resetPasswordForm.newPassword;
    const confirmPassword = resetPasswordForm.confirmPassword;

    if (!newPassword || !confirmPassword) {
      setMessage("Preencha os dois campos da nova senha.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("A confirmação da nova senha não confere.");
      return;
    }

    setResetPasswordLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      setResetPasswordForm({
        newPassword: "",
        confirmPassword: "",
      });
      await supabase.auth.signOut();
      setScreen("login");
      setMessage("Senha redefinida com sucesso. Você já pode entrar novamente.");
    } catch (error) {
      console.error("ERRO AO REDEFINIR SENHA:", error);
      setMessage(error.message || "Não foi possível redefinir sua senha.");
    } finally {
      setResetPasswordLoading(false);
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

    if (!profileForm.gender || !profileForm.sexuality || !profileForm.position || !profileForm.availability) {
      setMessage("Selecione identidade, sexualidade, posição e disponibilidade.");
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

  async function handleDeleteAccount() {
    if (deleteAccountLoading) return;

    setDeleteAccountLoading(true);
    setMessage("");

    try {
      const { data, error } = await supabase.functions.invoke("delete-account");

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      await supabase.auth.signOut();

      setDeleteAccountOpen(false);
      setScreen("ageGate");
      setAgeVerified(false);
      setMessage("");
      setPhotos([]);
      setPhotoFile(null);
      setLocationSaved(false);
      setUserLocation({ latitude: null, longitude: null });
      setNearbyProfiles([]);
      setCurrentUserId(null);
      setConversations([]);
      setLikedProfiles([]);
      setChatTarget(null);
      setChatConversation(null);
      setChatMessages([]);
      setChatText("");
    } catch (error) {
      console.error("ERRO AO EXCLUIR CONTA:", error);
      setMessage(error.message || "Não foi possível excluir sua conta.");
    } finally {
      setDeleteAccountLoading(false);
    }
  }

  async function handleChangePassword() {
    if (changePasswordLoading) return;

    const currentPassword = changePasswordForm.currentPassword;
    const newPassword = changePasswordForm.newPassword;
    const confirmPassword = changePasswordForm.confirmPassword;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Preencha todos os campos da senha.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("A confirmação da nova senha não confere.");
      return;
    }

    setChangePasswordLoading(true);
    setMessage("");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error("Não foi possível identificar sua conta.");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("A senha atual está incorreta.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setChangePasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setChangePasswordOpen(false);
      setMessage("Senha alterada com sucesso.");
    } catch (error) {
      console.error("ERRO AO ALTERAR SENHA:", error);
      setMessage(error.message || "Não foi possível alterar sua senha.");
    } finally {
      setChangePasswordLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    setScreen("ageGate");
    setAgeVerified(false);
    setMessage("");
    setPhotos([]);
    setPhotoFile(null);
    setLocationSaved(false);

    setUserLocation({
      latitude: null,
      longitude: null,
    });

    setNearbyProfiles([]);
    setCurrentUserId(null);
    setConversations([]);
    setLikedProfiles([]);
    setChatTarget(null);
    setChatConversation(null);
    setChatMessages([]);
    setChatText("");
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

      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            top: "22px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            width: "min(420px, calc(100% - 30px))",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(11, 11, 11, 0.97)",
            border: "1px solid #2a2a2a",
            boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
            backdropFilter: "blur(12px)",
            color: "#f4ead7",
          }}
        >
          <span
            style={{
              width: "34px",
              height: "34px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #2f2f2f",
              color: "#c9b58a",
              fontSize: "16px",
            }}
          >
            {toast.icon}
          </span>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                color: "#f4ead7",
                fontSize: "12px",
                letterSpacing: "1.2px",
                lineHeight: 1.4,
              }}
            >
              {toast.title}
            </div>
            {toast.body && (
              <div
                style={{
                  marginTop: "3px",
                  color: "#77736b",
                  fontSize: "11px",
                  lineHeight: 1.5,
                }}
              >
                {toast.body}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO 18+ */}

      {screen === "ageGate" && (
        <section className="home-screen">
          <div className="moon-logo">MOON</div>
          <p className="moon-tagline">FIND YOUR NIGHT.</p>
          <div style={{ maxWidth: "430px", margin: "45px auto 0", textAlign: "center" }}>
            <p style={{ color: "#f4ead7", fontSize: "18px", letterSpacing: "2px", marginBottom: "12px" }}>VOCÊ TEM 18 ANOS OU MAIS?</p>
            <p style={{ color: "#77736b", fontSize: "12px", lineHeight: "1.7", marginBottom: "28px" }}>A MOON é destinada exclusivamente a maiores de 18 anos.</p>
            <div className="home-buttons">
              <button type="button" onClick={() => { setAgeVerified(true); setScreen("home"); setMessage(""); }}>SIM, TENHO 18+</button>
              <button type="button" onClick={() => setMessage("Você precisa ter 18 anos ou mais para entrar na MOON.")}>NÃO TENHO 18</button>
            </div>
            {message && <p className="form-subtitle" style={{ marginTop: "20px" }}>{message}</p>}
          </div>
        </section>
      )}

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

          <button
            type="button"
            className="back-button"
            onClick={handleForgotPassword}
            disabled={forgotPasswordLoading}
            style={{ marginTop: "14px" }}
          >
            {forgotPasswordLoading ? "ENVIANDO..." : "ESQUECI MINHA SENHA"}
          </button>

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

      {/* REDEFINIR SENHA */}

      {screen === "resetPassword" && (
        <section className="form-screen">

          <div className="moon-logo">MOON</div>

          <h1>
            Nova senha
          </h1>

          <p className="form-subtitle">
            Escolha uma nova senha para sua conta.
          </p>

          <div style={{ display: "grid", gap: "12px" }}>
            <input
              type="password"
              placeholder="Nova senha"
              value={resetPasswordForm.newPassword}
              onChange={(event) => {
                setResetPasswordForm({
                  ...resetPasswordForm,
                  newPassword: event.target.value,
                });
                setMessage("");
              }}
              autoComplete="new-password"
            />

            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={resetPasswordForm.confirmPassword}
              onChange={(event) => {
                setResetPasswordForm({
                  ...resetPasswordForm,
                  confirmPassword: event.target.value,
                });
                setMessage("");
              }}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={handleResetPassword}
              disabled={resetPasswordLoading}
            >
              {resetPasswordLoading ? "SALVANDO..." : "SALVAR NOVA SENHA"}
            </button>
          </div>

          {message && (
            <p className="form-subtitle">
              {message}
            </p>
          )}

        </section>
      )}

      {/* DOCUMENTOS LEGAIS */}

      {legalPage && (
        <section
          style={{
            width: "100%",
            maxWidth: "760px",
            minHeight: "100vh",
            padding: "30px 20px 50px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <div className="moon-logo">MOON</div>
            <p className="moon-tagline">FIND YOUR NIGHT.</p>
          </div>

          <style>{`
            .legal-document { color: #aaa59b; font-size: 11px; line-height: 1.85; }
            .legal-document p { margin: 0 0 16px; }
            .legal-document h2 { color: #d6b97d; font-size: 10px; font-weight: 500; letter-spacing: 1.4px; margin: 28px 0 10px; }
            .legal-document strong { color: #d8d0c1; font-weight: 500; }
          `}</style>

          <div style={{ border: "1px solid #242424", background: "#0b0b0b", padding: "28px" }}>
            <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "2px", marginBottom: "10px" }}>
              MOON / {legalPage === "terms" ? "TERMOS DE USO" : legalPage === "privacy" ? "POLÍTICA DE PRIVACIDADE" : "POLÍTICA DE COOKIES"}
            </div>

            <h1 style={{ color: "#f4ead7", fontSize: "25px", fontWeight: "400", letterSpacing: "1px", margin: "0 0 10px" }}>
              {legalPage === "terms" ? "Termos de Uso" : legalPage === "privacy" ? "Política de Privacidade" : "Política de Cookies"}
            </h1>

            <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "1px", marginBottom: "26px" }}>
              ÚLTIMA ATUALIZAÇÃO: 14/09/2026
            </div>

            {legalPage === "terms" && (
              <div className="legal-document">
                <p>Bem-vindo à MOON. A MOON é uma plataforma digital de relacionamento e conexão social destinada exclusivamente a pessoas maiores de 18 anos.</p>
                <p>Ao acessar, criar uma conta ou utilizar a MOON, você declara que leu, compreendeu e concorda com estes Termos de Uso, com a Política de Privacidade e, quando aplicável, com a Política de Cookies.</p>

                <h2>1. SOBRE A MOON</h2>
                <p>A MOON permite que usuários criem perfis, adicionem fotografias, informem características pessoais, descubram pessoas próximas, utilizem filtros, curtam perfis, iniciem conversas, bloqueiem usuários, denunciem perfis e utilizem recursos pagos, como o Boost.</p>
                <p>A plataforma poderá modificar, adicionar ou remover funcionalidades ao longo do tempo. Nenhuma funcionalidade específica constitui obrigação de disponibilidade permanente.</p>

                <h2>2. REQUISITO DE IDADE</h2>
                <p>A MOON é destinada exclusivamente a pessoas com 18 anos ou mais. Ao criar ou utilizar uma conta, você declara possuir pelo menos 18 anos.</p>
                <p>É proibido utilizar informações falsas para contornar essa restrição. Caso seja identificada uma conta pertencente a pessoa menor de 18 anos, ela poderá ser suspensa ou encerrada.</p>

                <h2>3. CRIAÇÃO E SEGURANÇA DA CONTA</h2>
                <p>O usuário deve fornecer informações verdadeiras, atuais e completas. A conta é pessoal e não deve ser vendida, transferida, compartilhada ou utilizada em nome de outra pessoa.</p>
                <p>O usuário é responsável pela segurança de suas credenciais e deverá comunicar a MOON caso suspeite de acesso não autorizado.</p>

                <h2>4. PERFIL E AUTENTICIDADE</h2>
                <p>O perfil poderá conter nome ou nome de exibição, data de nascimento, fotografias, biografia, identidade, sexualidade, posição, disponibilidade e informações de localização utilizadas para recursos de proximidade.</p>
                <p>O usuário declara possuir os direitos necessários sobre as fotografias e conteúdos publicados. É proibido criar perfis falsos, utilizar fotografias de terceiros para se passar por outra pessoa ou fornecer informações fraudulentas.</p>

                <h2>5. DESCOBERTA E LOCALIZAÇÃO</h2>
                <p>A MOON poderá utilizar a localização autorizada pelo usuário para calcular proximidade e apresentar pessoas dentro dos critérios de descoberta. A localização apresentada pode ser aproximada e a MOON não garante precisão absoluta.</p>

                <h2>6. CURTIDAS E CONVERSAS</h2>
                <p>A MOON permite curtidas e conversas entre usuários conforme as funcionalidades disponíveis. Uma curtida ou conversa não significa que a MOON endosse, recomende ou garanta a identidade, comportamento, intenção ou segurança de qualquer usuário.</p>
                <p>As comunicações são interações entre usuários. A MOON não é parte dessas interações e não garante sua autenticidade, qualidade ou resultado.</p>

                <h2>7. ENCONTROS PRESENCIAIS</h2>
                <p>A MOON não organiza nem garante encontros presenciais. Caso usuários decidam se encontrar fora da plataforma, essa decisão é exclusivamente deles.</p>
                <p>Recomendamos encontros em locais públicos, comunicação com alguém de confiança e cautela ao compartilhar informações pessoais.</p>

                <h2>8. CONDUTAS PROIBIDAS</h2>
                <p>É proibido utilizar a MOON para assédio, perseguição, intimidação, ameaças, fraude, falsidade de identidade, spam, golpes, conteúdo ilegal, exploração sexual, qualquer conteúdo envolvendo menores de idade, discurso de ódio ou discriminação ilícita.</p>
                <p>Também é proibido tentar burlar sistemas de segurança, acessar contas de terceiros, utilizar bots sem autorização, realizar scraping não autorizado ou interferir no funcionamento da plataforma.</p>

                <h2>9. DENÚNCIAS, BLOQUEIOS E MODERAÇÃO</h2>
                <p>A MOON disponibiliza mecanismos para denúncia e bloqueio. As denúncias poderão ser analisadas pela equipe responsável pela plataforma.</p>
                <p>Dependendo da situação, a MOON poderá não tomar medidas, solicitar informações adicionais, emitir advertência, remover conteúdo, limitar funcionalidades, suspender ou banir uma conta.</p>

                <h2>10. SUSPENSÃO E BANIMENTO</h2>
                <p>A MOON poderá suspender ou banir contas que violem estes Termos, apresentem comportamento abusivo, pratiquem fraude, criem perfis falsos, utilizem a plataforma de maneira ilegal ou representem risco à comunidade.</p>
                <p>Uma conta banida poderá perder o acesso à plataforma. Não é permitido criar uma nova conta para contornar um banimento.</p>

                <h2>11. CONTEÚDO DO USUÁRIO</h2>
                <p>O usuário mantém seus direitos sobre os conteúdos publicados. Ao publicar conteúdo, concede à MOON uma licença limitada, não exclusiva e necessária para hospedar, armazenar, reproduzir tecnicamente, processar e disponibilizar esse conteúdo dentro da operação da plataforma.</p>
                <p>A MOON não adquire a propriedade das fotografias ou demais conteúdos do usuário.</p>

                <h2>12. BOOST E RECURSOS PAGOS</h2>
                <p>A MOON poderá disponibilizar recursos pagos, incluindo o Boost. O Boost poderá aumentar temporariamente a exposição de um perfil conforme as regras apresentadas no momento da contratação.</p>
                <p>A compra não garante curtidas, conversas, matches, visualizações específicas, encontros ou qualquer resultado determinado.</p>
                <p>Preços, duração e condições serão apresentados antes da confirmação. Pagamentos poderão ser processados por provedores especializados, como o Mercado Pago.</p>

                <h2>13. DISPONIBILIDADE</h2>
                <p>A MOON buscará manter a plataforma disponível, mas podem ocorrer manutenções, atualizações, falhas técnicas, indisponibilidade de serviços de terceiros ou outros eventos fora de seu controle.</p>

                <h2>14. PROPRIEDADE INTELECTUAL</h2>
                <p>A marca MOON, identidade visual, nome, logotipo, interface, código, textos e elementos próprios da plataforma são protegidos pela legislação aplicável. É proibida sua reprodução ou exploração comercial não autorizada.</p>

                <h2>15. PRIVACIDADE</h2>
                <p>O tratamento de dados pessoais é descrito na Política de Privacidade da MOON, que integra estes Termos.</p>

                <h2>16. RESPONSABILIDADE</h2>
                <p>A MOON fornece uma plataforma de conexão entre usuários. Não garante a autenticidade de todos os perfis, a intenção dos usuários, a qualidade das conversas, a compatibilidade entre pessoas ou a segurança de interações realizadas fora da plataforma.</p>
                <p>Nada nestes Termos tem por objetivo excluir direitos que não possam ser legalmente excluídos.</p>

                <h2>17. ENCERRAMENTO DA CONTA</h2>
                <p>O usuário poderá solicitar o encerramento da conta pelas funcionalidades disponibilizadas. A exclusão de dados observará a legislação aplicável, obrigações legais, necessidades de segurança e demais hipóteses que permitam ou exijam conservação.</p>

                <h2>18. ALTERAÇÕES</h2>
                <p>A MOON poderá atualizar estes Termos para refletir mudanças na plataforma, legislação, segurança ou modelo de negócio. Alterações relevantes poderão ser comunicadas por meios razoáveis.</p>

                <h2>19. LEGISLAÇÃO APLICÁVEL</h2>
                <p>Estes Termos serão interpretados de acordo com as leis da República Federativa do Brasil, observadas as regras aplicáveis de proteção ao consumidor.</p>

                <h2>20. CONTATO</h2>
                <p><strong>Responsável:</strong> APL AGENCIA</p>
                <p><strong>CNPJ:</strong> 52.405.299/0001-68</p>
                <p><strong>Endereço:</strong> Florianópolis, SC, Vargem do Bom Jesus</p>
                <p><strong>E-mail:</strong> moonapp04@gmail.com</p>
              </div>
            )}

            {legalPage === "privacy" && (
              <div className="legal-document">
                <p>A MOON respeita a privacidade de seus usuários. Esta Política explica como coletamos, utilizamos, armazenamos, protegemos e compartilhamos dados pessoais no contexto da utilização da plataforma, observando a legislação brasileira aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais (LGPD).</p>

                <h2>1. CONTROLADOR</h2>
                <p><strong>Responsável:</strong> APL AGENCIA</p>
                <p><strong>CNPJ:</strong> 52.405.299/0001-68</p>
                <p><strong>Endereço:</strong> Florianópolis, SC, Vargem do Bom Jesus</p>
                <p><strong>E-mail:</strong> moonapp04@gmail.com</p>

                <h2>2. DADOS QUE PODEMOS TRATAR</h2>
                <p>Podemos tratar dados de cadastro, como nome ou nome de exibição, e-mail, telefone quando utilizado, data de nascimento e informações necessárias à autenticação.</p>
                <p>Também podemos tratar dados do perfil, como fotografias, biografia, identidade, sexualidade, posição e disponibilidade.</p>
                <p>Podemos tratar dados de localização, como latitude, longitude e informações necessárias para calcular distância aproximada.</p>
                <p>Também podem ser tratados dados de utilização, incluindo atividade recente, curtidas, conversas, bloqueios, denúncias e informações relacionadas à segurança e moderação.</p>

                <h2>3. DADOS PESSOAIS SENSÍVEIS</h2>
                <p>Algumas informações utilizadas na MOON podem se enquadrar como dados pessoais sensíveis, especialmente informações relacionadas à sexualidade. Essas informações são tratadas para permitir o funcionamento das funcionalidades de perfil e descoberta, com observância da base legal adequada e das exigências aplicáveis aos dados sensíveis.</p>

                <h2>4. FINALIDADES</h2>
                <p>Os dados podem ser utilizados para criar e administrar contas, autenticar usuários, permitir recuperação de acesso, operar descoberta e filtros, calcular proximidade, permitir curtidas e conversas, realizar bloqueios, analisar denúncias, prevenir abusos e fraudes, aplicar medidas de moderação, processar pagamentos e cumprir obrigações legais.</p>

                <h2>5. LOCALIZAÇÃO</h2>
                <p>Quando autorizada, a localização poderá ser utilizada para calcular distância e encontrar usuários próximos. A localização exata não é destinada à exibição pública no perfil. A distância apresentada pode ser aproximada.</p>

                <h2>6. VISIBILIDADE DO PERFIL</h2>
                <p>Determinadas informações poderão ser disponibilizadas a outros usuários, como nome de exibição, idade, fotografias, biografia, informações selecionadas do perfil, disponibilidade e distância aproximada.</p>

                <h2>7. CONVERSAS E DENÚNCIAS</h2>
                <p>As mensagens são tratadas para entrega, armazenamento, sincronização, segurança, prevenção de abuso e cumprimento de obrigações. Informações relacionadas a denúncias poderão ser tratadas para investigação, segurança, prevenção de reincidência e moderação.</p>

                <h2>8. COMPARTILHAMENTO</h2>
                <p>Podemos compartilhar dados com prestadores necessários à operação da MOON, incluindo fornecedores de infraestrutura, autenticação, banco de dados, pagamentos e serviços técnicos.</p>
                <p>Atualmente, a infraestrutura poderá envolver serviços como Supabase e o processamento de pagamentos poderá envolver o Mercado Pago. Também poderemos compartilhar informações quando exigido por lei, ordem judicial, autoridade competente, prevenção de fraude, proteção da segurança ou exercício regular de direitos.</p>

                <h2>9. TRANSFERÊNCIA INTERNACIONAL</h2>
                <p>Dependendo da infraestrutura e dos prestadores utilizados, determinados dados poderão ser processados ou armazenados fora do Brasil. Quando aplicável, serão observados os mecanismos e requisitos previstos na legislação brasileira.</p>

                <h2>10. SEGURANÇA</h2>
                <p>A MOON adota medidas técnicas e organizacionais destinadas a proteger os dados contra acesso não autorizado, perda, destruição, alteração ou divulgação indevida. Nenhum sistema conectado à internet, entretanto, pode garantir segurança absoluta.</p>

                <h2>11. RETENÇÃO</h2>
                <p>Os dados serão mantidos pelo período necessário às finalidades descritas nesta Política. Após o encerramento da conta, determinadas informações poderão ser eliminadas ou anonimizadas, sem prejuízo de dados que devam ser conservados para cumprimento de obrigação legal, segurança, prevenção de fraude ou exercício regular de direitos.</p>

                <h2>12. DIREITOS DO TITULAR</h2>
                <p>Nos termos da LGPD, o titular poderá exercer direitos como confirmação da existência de tratamento, acesso, correção, atualização, informações sobre tratamento e compartilhamentos, eliminação quando aplicável, portabilidade nos termos da regulamentação, oposição quando aplicável e revogação de consentimento quando essa for a base utilizada.</p>

                <h2>13. COMO EXERCER SEUS DIREITOS</h2>
                <p>Solicitações relacionadas à privacidade podem ser encaminhadas para <strong>moonapp04@gmail.com</strong>. O pedido poderá estar sujeito às limitações e requisitos previstos na legislação.</p>

                <h2>14. MENORES DE IDADE</h2>
                <p>A MOON não é destinada a menores de 18 anos. Caso seja identificada uma conta pertencente a menor de idade, ela poderá ser encerrada e as medidas necessárias serão adotadas em relação aos dados correspondentes.</p>

                <h2>15. ALTERAÇÕES</h2>
                <p>Esta Política poderá ser atualizada para refletir mudanças na plataforma, legislação, fornecedores, segurança ou práticas de tratamento. Alterações relevantes poderão ser comunicadas por meios adequados.</p>

                <h2>16. CONTATO</h2>
                <p><strong>Responsável:</strong> APL AGENCIA</p>
                <p><strong>CNPJ:</strong> 52.405.299/0001-68</p>
                <p><strong>Endereço:</strong> Florianópolis, SC, Vargem do Bom Jesus</p>
                <p><strong>E-mail de privacidade:</strong> moonapp04@gmail.com</p>
              </div>
            )}

            {legalPage === "cookies" && (
              <div className="legal-document">
                <p>A MOON utiliza cookies e tecnologias semelhantes quando necessários para autenticação, segurança, funcionamento e melhoria da plataforma.</p>

                <h2>1. O QUE SÃO COOKIES?</h2>
                <p>Cookies são pequenos arquivos ou identificadores armazenados no dispositivo do usuário, ou tecnologias semelhantes, utilizados para permitir determinadas funcionalidades e reconhecer informações relacionadas à sessão ou preferências.</p>

                <h2>2. COOKIES NECESSÁRIOS</h2>
                <p>São tecnologias necessárias para o funcionamento da plataforma, incluindo manutenção de sessão autenticada, segurança, prevenção de atividades indevidas e funcionamento de recursos essenciais.</p>

                <h2>3. COOKIES DE FUNCIONALIDADE</h2>
                <p>Podem ser utilizados para lembrar determinadas preferências e facilitar a utilização da MOON.</p>

                <h2>4. COOKIES ANALÍTICOS</h2>
                <p>Caso serviços de análise sejam adicionados à plataforma, poderão ser utilizadas tecnologias para compreender uso, desempenho, erros e funcionalidades acessadas. A MOON atualizará esta Política quando houver inclusão relevante desses serviços.</p>

                <h2>5. COOKIES DE PUBLICIDADE</h2>
                <p>Caso tecnologias de publicidade ou marketing sejam utilizadas futuramente, esta Política será atualizada e, quando necessário, será disponibilizado mecanismo adequado de gerenciamento de consentimento.</p>

                <h2>6. TECNOLOGIAS DE TERCEIROS</h2>
                <p>Serviços de terceiros utilizados na operação da MOON poderão empregar suas próprias tecnologias, de acordo com suas políticas. A utilização efetiva dependerá da configuração da plataforma.</p>

                <h2>7. GERENCIAMENTO</h2>
                <p>O usuário poderá gerenciar cookies por meio das configurações do navegador. A desativação de tecnologias necessárias poderá prejudicar ou impedir determinadas funcionalidades.</p>

                <h2>8. RETENÇÃO</h2>
                <p>Cookies podem possuir diferentes períodos de retenção. Alguns existem somente durante a sessão, enquanto outros podem permanecer por período determinado conforme sua finalidade.</p>

                <h2>9. ALTERAÇÕES</h2>
                <p>Esta Política poderá ser atualizada quando forem adicionadas novas tecnologias, fornecedores ou funcionalidades relacionadas a cookies.</p>

                <h2>10. CONTATO</h2>
                <p><strong>Responsável:</strong> APL AGENCIA</p>
                <p><strong>CNPJ:</strong> 52.405.299/0001-68</p>
                <p><strong>Endereço:</strong> Florianópolis, SC, Vargem do Bom Jesus</p>
                <p><strong>E-mail:</strong> moonapp04@gmail.com</p>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
            <button
              className="back-button"
              type="button"
              onClick={() => { setLegalPage(null); setMessage(""); }}
            >
              VOLTAR
            </button>
          </div>
        </section>
      )}

      {/* CONFIGURAÇÕES */}

      {screen === "admin" && isAdmin && (
        <main className="moon-page">
          <section className="moon-panel" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div><div className="moon-eyebrow">MOON</div><h1>Painel Administrativo</h1><p>Acompanhe a atividade da plataforma em um só lugar.</p></div>
              <button
                type="button"
                onClick={() => setScreen("profile")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "1px solid rgba(214, 185, 125, 0.28)",
                  background: "transparent",
                  color: "#d6b97d",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  cursor: "pointer",
                }}
              >
                ← VOLTAR
              </button>
            </div>
            {adminLoading ? <p>Carregando dados do painel...</p> : adminStats ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                  {[["USUÁRIOS",adminStats.totalUsers],["ATIVOS",adminStats.activeUsers],["CURTIDAS",adminStats.likes],["CONVERSAS",adminStats.conversations],["MENSAGENS",adminStats.messages],["BOOSTS",adminStats.boosts],["BOOSTS ATIVOS",adminStats.activeBoosts],["DENÚNCIAS",adminStats.reports],["BLOQUEIOS",adminStats.blocks],["FATURAMENTO",`R$ ${adminStats.revenue.toFixed(2).replace(".",",")}`]].map(([label,value]) => (
                    <div
                      key={label}
                      onClick={label === "DENÚNCIAS" ? async () => {
                        setScreen("adminReports");
                        await loadAdminReports();
                      } : undefined}
                      style={{
                        border: label === "DENÚNCIAS" ? "1px solid rgba(214, 185, 125, .38)" : "1px solid rgba(255,255,255,.12)",
                        borderRadius: "14px",
                        padding: "18px",
                        background: label === "DENÚNCIAS" ? "rgba(214, 185, 125, .055)" : "rgba(255,255,255,.035)",
                        cursor: label === "DENÚNCIAS" ? "pointer" : "default",
                        transition: "border-color .2s ease, background .2s ease",
                      }}
                    >
                      <div style={{ fontSize: "11px", letterSpacing: ".14em", opacity: .65, marginBottom: "9px" }}>{label}</div>
                      <strong style={{ fontSize: "28px" }}>{value}</strong>
                      {label === "DENÚNCIAS" && <div style={{ marginTop: "8px", color: "#d6b97d", fontSize: "9px", letterSpacing: ".12em" }}>VER DENÚNCIAS →</div>}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
                  <button
                    type="button"
                    onClick={loadAdminStats}
                    style={{
                      padding: "11px 20px",
                      borderRadius: "999px",
                      border: "1px solid rgba(214, 185, 125, 0.32)",
                      background: "rgba(214, 185, 125, 0.06)",
                      color: "#d6b97d",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      cursor: "pointer",
                    }}
                  >
                    ↻ &nbsp; ATUALIZAR DADOS
                  </button>
                </div>
              </>
            ) : <p>Nenhum dado disponível.</p>}
          </section>
        </main>
      )}

      {screen === "adminAdvertisements" && isAdmin && (
        <main className="moon-page">
          <section className="moon-panel" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div>
                <div className="moon-eyebrow">MOON</div>
                <h1>Publicidade</h1>
                <p>Gerencie os anúncios exibidos na descoberta.</p>
              </div>

              <button
                type="button"
                onClick={() => setScreen("admin")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "1px solid rgba(214, 185, 125, 0.28)",
                  background: "transparent",
                  color: "#d6b97d",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  cursor: "pointer",
                }}
              >
                ← VOLTAR
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <button
                type="button"
                onClick={() => {
                  resetAdvertisementForm();
                  setShowAdvertisementForm(true);
                  setMessage("");
                }}
                style={{
                  padding: "12px 22px",
                  borderRadius: "999px",
                  border: "1px solid rgba(214, 185, 125, 0.35)",
                  background: "rgba(214, 185, 125, 0.07)",
                  color: "#d6b97d",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  cursor: "pointer",
                }}
              >
                + CRIAR ANÚNCIO
              </button>
            </div>

            {showAdvertisementForm && (
              <form
                onSubmit={handleCreateAdvertisement}
                style={{
                  border: "1px solid #242424",
                  background: "#0b0b0b",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <div className="moon-eyebrow" style={{ marginBottom: "16px" }}>
                  NOVO ANÚNCIO
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
                  {[
                    ["company_name", "EMPRESA", "Nome da empresa"],
                    ["title", "TÍTULO", "Título do anúncio"],
                    ["cta_text", "BOTÃO", "SAIBA MAIS"],
                    ["destination_url", "LINK", "https://..."],
                  ].map(([field, label, placeholder]) => (
                    <label key={field}>
                      <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "0.14em", marginBottom: "7px" }}>
                        {label}
                      </div>
                      <input
                        value={advertisementForm[field]}
                        onChange={(event) =>
                          setAdvertisementForm((current) => ({
                            ...current,
                            [field]: event.target.value,
                          }))
                        }
                        placeholder={placeholder}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          minHeight: "44px",
                          padding: "10px 12px",
                          border: "1px solid #292929",
                          background: "#080808",
                          color: "#f4ead7",
                          outline: "none",
                          fontFamily: "inherit",
                          fontSize: "11px",
                        }}
                      />
                    </label>
                  ))}
                </div>

                <label style={{ display: "block", marginTop: "14px" }}>
                  <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "0.14em", marginBottom: "7px" }}>
                    DESCRIÇÃO
                  </div>
                  <textarea
                    value={advertisementForm.description}
                    onChange={(event) =>
                      setAdvertisementForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Descrição curta da empresa..."
                    maxLength={300}
                    rows={3}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      resize: "vertical",
                      padding: "11px 12px",
                      border: "1px solid #292929",
                      background: "#080808",
                      color: "#f4ead7",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "11px",
                      lineHeight: "1.6",
                    }}
                  />
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px", marginTop: "14px" }}>
                  <label>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "0.14em", marginBottom: "7px" }}>
                      IMAGEM
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => setAdvertisementImageFile(event.target.files?.[0] || null)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        minHeight: "44px",
                        padding: "9px",
                        border: "1px solid #292929",
                        background: "#080808",
                        color: "#8a857c",
                        fontFamily: "inherit",
                        fontSize: "10px",
                      }}
                    />
                  </label>

                  <label>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "0.14em", marginBottom: "7px" }}>
                      INÍCIO
                    </div>
                    <input
                      type="datetime-local"
                      value={advertisementForm.starts_at}
                      onChange={(event) =>
                        setAdvertisementForm((current) => ({ ...current, starts_at: event.target.value }))
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        minHeight: "44px",
                        padding: "10px",
                        border: "1px solid #292929",
                        background: "#080808",
                        color: "#f4ead7",
                        fontFamily: "inherit",
                        fontSize: "10px",
                      }}
                    />
                  </label>

                  <label>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "0.14em", marginBottom: "7px" }}>
                      TÉRMINO
                    </div>
                    <input
                      type="datetime-local"
                      value={advertisementForm.ends_at}
                      onChange={(event) =>
                        setAdvertisementForm((current) => ({ ...current, ends_at: event.target.value }))
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        minHeight: "44px",
                        padding: "10px",
                        border: "1px solid #292929",
                        background: "#080808",
                        color: "#f4ead7",
                        fontFamily: "inherit",
                        fontSize: "10px",
                      }}
                    />
                  </label>

                  <label>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "0.14em", marginBottom: "7px" }}>
                      FREQUÊNCIA
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={advertisementForm.display_frequency}
                      onChange={(event) =>
                        setAdvertisementForm((current) => ({ ...current, display_frequency: event.target.value }))
                      }
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        minHeight: "44px",
                        padding: "10px",
                        border: "1px solid #292929",
                        background: "#080808",
                        color: "#f4ead7",
                        fontFamily: "inherit",
                        fontSize: "10px",
                      }}
                    />
                  </label>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: "9px", marginTop: "15px", color: "#aaa39a", fontSize: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={advertisementForm.is_active}
                    onChange={(event) =>
                      setAdvertisementForm((current) => ({ ...current, is_active: event.target.checked }))
                    }
                  />
                  ATIVAR PUBLICIDADE IMEDIATAMENTE
                </label>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "18px" }}>
                  <button
                    type="button"
                    onClick={() => {
                      resetAdvertisementForm();
                      setShowAdvertisementForm(false);
                    }}
                    disabled={advertisementSaving}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,.10)",
                      background: "transparent",
                      color: "#8a857c",
                      fontSize: "8px",
                      letterSpacing: ".12em",
                      cursor: "pointer",
                    }}
                  >
                    CANCELAR
                  </button>

                  <button
                    type="submit"
                    disabled={advertisementSaving}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "999px",
                      border: "1px solid rgba(214,185,125,.35)",
                      background: "rgba(214,185,125,.07)",
                      color: "#d6b97d",
                      fontSize: "8px",
                      fontWeight: 600,
                      letterSpacing: ".12em",
                      cursor: "pointer",
                      opacity: advertisementSaving ? .55 : 1,
                    }}
                  >
                    {advertisementSaving ? "SALVANDO..." : "CRIAR ANÚNCIO"}
                  </button>
                </div>
              </form>
            )}

            {advertisementsLoading ? (
              <p>Carregando publicidades...</p>
            ) : advertisements.length === 0 ? (
              <div style={{ border: "1px solid #242424", background: "#0b0b0b", padding: "30px", textAlign: "center", color: "#77736b", fontSize: "10px", letterSpacing: ".12em" }}>
                NENHUMA PUBLICIDADE CADASTRADA.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {advertisements.map((advertisement) => {
                  const now = Date.now();
                  const starts = new Date(advertisement.starts_at).getTime();
                  const ends = advertisement.ends_at ? new Date(advertisement.ends_at).getTime() : null;
                  const statusLabel =
                    ends !== null && ends < now
                      ? "EXPIRADO"
                      : starts > now
                        ? "AGENDADO"
                        : advertisement.is_active
                          ? "ATIVO"
                          : "INATIVO";

                  return (
                    <div
                      key={advertisement.id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "92px minmax(0, 1fr) auto",
                        gap: "15px",
                        alignItems: "center",
                        padding: "13px",
                        border: "1px solid rgba(255,255,255,.08)",
                        background: "rgba(255,255,255,.02)",
                      }}
                    >
                      <div style={{ width: "92px", height: "92px", overflow: "hidden", background: "#0b0b0b" }}>
                        {advertisement.image_url && (
                          <img
                            src={advertisement.image_url}
                            alt={advertisement.company_name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: "#d6b97d", fontSize: "8px", letterSpacing: ".13em", marginBottom: "5px" }}>
                          {statusLabel}
                        </div>
                        <div style={{ color: "#f4ead7", fontSize: "14px", marginBottom: "4px" }}>
                          {advertisement.company_name}
                        </div>
                        <div style={{ color: "#aaa39a", fontSize: "11px", marginBottom: "6px" }}>
                          {advertisement.title}
                        </div>
                        <div style={{ color: "#77736c", fontSize: "9px" }}>
                          1 anúncio a cada {advertisement.display_frequency} perfis
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggleAdvertisement(advertisement)}
                          style={{
                            minWidth: "105px",
                            padding: "8px 10px",
                            borderRadius: "999px",
                            border: "1px solid rgba(214,185,125,.20)",
                            background: "transparent",
                            color: "#d6b97d",
                            fontSize: "7px",
                            letterSpacing: ".10em",
                            cursor: "pointer",
                          }}
                        >
                          {advertisement.is_active ? "PAUSAR" : "ATIVAR"}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAdvertisement(advertisement)}
                          style={{
                            minWidth: "105px",
                            padding: "8px 10px",
                            borderRadius: "999px",
                            border: "1px solid rgba(211,107,95,.18)",
                            background: "transparent",
                            color: "#d36b5f",
                            fontSize: "7px",
                            letterSpacing: ".10em",
                            cursor: "pointer",
                          }}
                        >
                          EXCLUIR
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}

      {screen === "adminReports" && isAdmin && (
        <main className="moon-page">
          <section className="moon-panel" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div>
                <div className="moon-eyebrow">MOON</div>
                <h1>Denúncias</h1>
                <p>Analise os relatos enviados pelos usuários e acompanhe a moderação.</p>
              </div>

              <button
                type="button"
                onClick={() => setScreen("admin")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "999px",
                  border: "1px solid rgba(214, 185, 125, 0.28)",
                  background: "transparent",
                  color: "#d6b97d",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  cursor: "pointer",
                }}
              >
                ← VOLTAR
              </button>
            </div>

            {!adminReportsLoading && adminReports.length > 0 && (() => {
              const uniqueReportedUsers = new Map();

              adminReports.forEach((report) => {
                if (report.reported_user_id && !uniqueReportedUsers.has(report.reported_user_id)) {
                  uniqueReportedUsers.set(report.reported_user_id, report);
                }
              });

              const riskProfiles = [...uniqueReportedUsers.values()];
              const critical = riskProfiles.filter((report) => report.pendingReportCount >= 10).length;
              const high = riskProfiles.filter((report) => report.pendingReportCount >= 6 && report.pendingReportCount < 10).length;
              const attention = riskProfiles.filter((report) => report.pendingReportCount >= 3 && report.pendingReportCount < 6).length;

              return (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                  gap: "10px",
                  marginBottom: "18px",
                }}>
                  {[
                    ["CRÍTICOS", critical, "#d36b5f"],
                    ["ALTA ATENÇÃO", high, "#c99a55"],
                    ["ATENÇÃO", attention, "#d6b97d"],
                    ["DENÚNCIAS PENDENTES", adminReports.filter((report) => report.status === "pending").length, "#f4ead7"],
                  ].map(([label, value, accent]) => (
                    <div
                      key={label}
                      style={{
                        border: "1px solid rgba(255,255,255,.08)",
                        borderRadius: "12px",
                        padding: "15px",
                        background: "rgba(255,255,255,.025)",
                      }}
                    >
                      <div style={{ color: "#77736c", fontSize: "8px", letterSpacing: ".14em", marginBottom: "8px" }}>
                        {label}
                      </div>
                      <div style={{ color: accent, fontSize: "23px", fontWeight: 600 }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {adminReportsLoading ? (
              <p>Carregando denúncias...</p>
            ) : adminReports.length === 0 ? (
              <div style={{
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: "14px",
                padding: "36px 22px",
                textAlign: "center",
                background: "rgba(255,255,255,.025)",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>✓</div>
                <div style={{ color: "#f4ead7", fontSize: "13px", letterSpacing: ".12em" }}>
                  NENHUMA DENÚNCIA
                </div>
                <p style={{ color: "#8a857c", fontSize: "11px", lineHeight: "1.7", margin: "10px 0 0" }}>
                  Não existem denúncias registradas no momento.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {adminReports.map((report) => (
                  <article
                    key={report.id}
                    style={{
                      border: report.status === "pending"
                        ? "1px solid rgba(214, 185, 125, .28)"
                        : "1px solid rgba(255,255,255,.10)",
                      borderRadius: "14px",
                      padding: "20px",
                      background: "rgba(255,255,255,.025)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "14px", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "18px" }}>
                      <div>
                        <div style={{ color: "#d6b97d", fontSize: "9px", letterSpacing: ".16em", marginBottom: "7px" }}>
                          DENÚNCIA #{String(report.id).slice(0, 8).toUpperCase()}
                        </div>
                        <div style={{ color: "#8a857c", fontSize: "10px" }}>
                          {report.created_at ? new Date(report.created_at).toLocaleString("pt-BR") : ""}
                        </div>
                      </div>

                      <span style={{
                        padding: "6px 10px",
                        borderRadius: "999px",
                        border: "1px solid rgba(214, 185, 125, .25)",
                        color: "#d6b97d",
                        fontSize: "9px",
                        letterSpacing: ".12em",
                      }}>
                        {report.status === "pending" ? "PENDENTE" : report.status === "action_taken" ? "AÇÃO TOMADA" : report.status === "dismissed" ? "ARQUIVADA" : "REVISADA"}
                      </span>
                    </div>

                    {(() => {
                      const count = report.pendingReportCount || 0;
                      const risk = count >= 10
                        ? { label: "CRÍTICO", description: "Perfil suspenso automaticamente", border: "rgba(211,107,95,.45)", color: "#d36b5f" }
                        : count >= 6
                          ? { label: "ALTA ATENÇÃO", description: "Requer análise prioritária", border: "rgba(201,154,85,.40)", color: "#c99a55" }
                          : count >= 3
                            ? { label: "ATENÇÃO", description: "Acompanhar perfil", border: "rgba(214,185,125,.30)", color: "#d6b97d" }
                            : { label: "NORMAL", description: "Sem alerta por volume", border: "rgba(255,255,255,.10)", color: "#8a857c" };

                      return (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          flexWrap: "wrap",
                          padding: "12px 14px",
                          marginBottom: "16px",
                          border: `1px solid ${risk.border}`,
                          borderRadius: "10px",
                          background: "rgba(255,255,255,.018)",
                        }}>
                          <div>
                            <div style={{ color: risk.color, fontSize: "9px", fontWeight: 600, letterSpacing: ".14em" }}>
                              {risk.label}
                            </div>
                            <div style={{ color: "#8a857c", fontSize: "10px", marginTop: "4px" }}>
                              {risk.description}
                            </div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#f4ead7", fontSize: "17px", fontWeight: 600 }}>
                              {count}
                            </div>
                            <div style={{ color: "#77736c", fontSize: "8px", letterSpacing: ".10em" }}>
                              DENÚNCIAS PENDENTES
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                      <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: "10px", padding: "14px" }}>
                        <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".13em", marginBottom: "7px" }}>QUEM DENUNCIOU</div>
                        <div style={{ color: "#f4ead7", fontSize: "13px" }}>{report.reporter?.name || "Usuário não encontrado"}</div>
                        {report.reporter?.birth_date && <div style={{ color: "#8a857c", fontSize: "10px", marginTop: "4px" }}>{calculateAge(report.reporter.birth_date)} anos</div>}
                      </div>

                      <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: "10px", padding: "14px" }}>
                        <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".13em", marginBottom: "7px" }}>DENUNCIADO</div>
                        <div style={{ color: "#f4ead7", fontSize: "13px" }}>{report.reported?.name || "Usuário não encontrado"}</div>
                        {report.reported?.birth_date && <div style={{ color: "#8a857c", fontSize: "10px", marginTop: "4px" }}>{calculateAge(report.reported.birth_date)} anos</div>}
                      </div>
                    </div>

                    <div style={{ marginBottom: "12px" }}>
                      <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".13em", marginBottom: "7px" }}>MOTIVO</div>
                      <div style={{ color: "#f4ead7", fontSize: "13px" }}>{report.reason || "Não informado"}</div>
                    </div>

                    <div>
                      <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".13em", marginBottom: "7px" }}>RELATO</div>
                      <div style={{ color: "#aaa59b", fontSize: "12px", lineHeight: "1.7" }}>
                        {report.description || "Nenhum relato adicional foi informado."}
                      </div>
                    </div>

                    {report.admin_action && (
                      <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                        <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".13em", marginBottom: "7px" }}>AÇÃO ADMINISTRATIVA</div>
                        <div style={{ color: "#d6b97d", fontSize: "12px" }}>{{
                          keep: "MANTER PERFIL",
                          warn: "ADVERTÊNCIA",
                          suspend: "SUSPENSO",
                          ban: "BANIDO",
                        }[report.admin_action] || report.admin_action}</div>
                        {report.admin_note && <div style={{ color: "#8a857c", fontSize: "11px", marginTop: "5px" }}>{report.admin_note}</div>}
                      </div>
                    )}

                    {report.status === "pending" && (
                      <div style={{
                        marginTop: "18px",
                        paddingTop: "16px",
                        borderTop: "1px solid rgba(255,255,255,.08)",
                      }}>
                        <div style={{
                          color: "#77736c",
                          fontSize: "9px",
                          letterSpacing: ".13em",
                          marginBottom: "10px",
                        }}>
                          AÇÃO ADMINISTRATIVA
                        </div>

                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: "8px",
                        }}>
                          {[
                            ["keep", "MANTER", "#d6b97d"],
                            ["warn", "ADVERTIR", "#d6b97d"],
                            ["suspend", "SUSPENDER", "#c99a55"],
                            ["ban", "BANIR", "#d36b5f"],
                          ].map(([value, label, accent]) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => {
                                setAdminActionReportId(report.id);
                                setAdminAction(value);
                                setAdminActionNote("");
                              }}
                              disabled={adminActionLoading}
                              style={{
                                minHeight: "40px",
                                borderRadius: "8px",
                                border: `1px solid ${adminAction === value && adminActionReportId === report.id ? accent : "rgba(255,255,255,.10)"}`,
                                background: adminAction === value && adminActionReportId === report.id ? "rgba(214,185,125,.08)" : "rgba(255,255,255,.02)",
                                color: accent,
                                fontSize: "8px",
                                fontWeight: 600,
                                letterSpacing: ".10em",
                                cursor: adminActionLoading ? "default" : "pointer",
                                opacity: adminActionLoading ? .55 : 1,
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {adminActionReportId === report.id && (
                          <div style={{ marginTop: "12px" }}>
                            <textarea
                              value={adminActionNote}
                              onChange={(event) => setAdminActionNote(event.target.value)}
                              placeholder="Observação administrativa (opcional)..."
                              maxLength={500}
                              rows={3}
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                resize: "vertical",
                                minHeight: "76px",
                                padding: "11px",
                                border: "1px solid #292929",
                                background: "#080808",
                                color: "#f4ead7",
                                outline: "none",
                                fontFamily: "inherit",
                                fontSize: "11px",
                                lineHeight: "1.6",
                              }}
                            />

                            <div style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "8px",
                              marginTop: "8px",
                            }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminActionReportId(null);
                                  setAdminAction("");
                                  setAdminActionNote("");
                                }}
                                disabled={adminActionLoading}
                                style={{
                                  padding: "9px 14px",
                                  borderRadius: "999px",
                                  border: "1px solid rgba(255,255,255,.10)",
                                  background: "transparent",
                                  color: "#8a857c",
                                  fontSize: "8px",
                                  letterSpacing: ".12em",
                                  cursor: adminActionLoading ? "default" : "pointer",
                                }}
                              >
                                CANCELAR
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAdminReview(report)}
                                disabled={adminActionLoading}
                                style={{
                                  padding: "9px 16px",
                                  borderRadius: "999px",
                                  border: "1px solid rgba(214,185,125,.35)",
                                  background: "rgba(214,185,125,.07)",
                                  color: "#d6b97d",
                                  fontSize: "8px",
                                  fontWeight: 600,
                                  letterSpacing: ".12em",
                                  cursor: adminActionLoading ? "default" : "pointer",
                                  opacity: adminActionLoading ? .55 : 1,
                                }}
                              >
                                {adminActionLoading ? "SALVANDO..." : "CONFIRMAR AÇÃO"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
              <button
                type="button"
                onClick={loadAdminReports}
                disabled={adminReportsLoading}
                style={{
                  padding: "11px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(214, 185, 125, 0.32)",
                  background: "rgba(214, 185, 125, 0.06)",
                  color: "#d6b97d",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  cursor: adminReportsLoading ? "default" : "pointer",
                  opacity: adminReportsLoading ? 0.55 : 1,
                }}
              >
                ↻ &nbsp; ATUALIZAR DENÚNCIAS
              </button>
            </div>
          </section>
        </main>
      )}

      {screen === "settings" && (
        <section
          style={{
            width: "100%",
            maxWidth: "700px",
            minHeight: "100vh",
            padding: "30px 20px 50px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "38px" }}>
            <div className="moon-logo">MOON</div>
            <p className="moon-tagline">FIND YOUR NIGHT.</p>
          </div>

          <h1 style={{ color: "#f4ead7", textAlign: "center", fontSize: "24px", fontWeight: "400", letterSpacing: "2px", margin: "0 0 8px" }}>
            Configurações
          </h1>
          <p className="form-subtitle" style={{ textAlign: "center", marginBottom: "32px" }}>
            Controle sua experiência na MOON.
          </p>

          <div style={{ border: "1px solid #242424", background: "#0b0b0b" }}>
            {isAdmin && currentUserId === "41dab763-1cdc-46a7-9efb-023d31c5b5d8" && (
              <>
                      <button
                        type="button"
                        onClick={openAdminPanel}
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "14px 16px",
                          borderRadius: "12px",
                          border: "1px solid rgba(214, 185, 125, 0.38)",
                          background: "linear-gradient(180deg, rgba(214, 185, 125, 0.10), rgba(214, 185, 125, 0.04))",
                          color: "#d6b97d",
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.16em",
                          textAlign: "left",
                          cursor: "pointer",
                          boxShadow: "none",
                        }}
                      >
                        ♙ &nbsp; PAINEL ADMINISTRATIVO
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowAdvertisementForm(false);
                          resetAdvertisementForm();
                          setScreen("adminAdvertisements");
                          loadAdvertisements();
                        }}
                        style={{
                          width: "100%",
                          marginTop: "10px",
                          padding: "14px 16px",
                          borderRadius: "12px",
                          border: "1px solid rgba(214, 185, 125, 0.28)",
                          background: "rgba(214, 185, 125, 0.04)",
                          color: "#d6b97d",
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.16em",
                          textAlign: "left",
                          cursor: "pointer",
                          boxShadow: "none",
                        }}
                      >
                        📢 &nbsp; PUBLICIDADE
                      </button>
              </>
            )}

                    <button
              type="button"
              onClick={handleLogout}
              style={{
                width: "100%",
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "none",
                borderBottom: "1px solid #242424",
                background: "transparent",
                color: "#f4ead7",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "1.8px",
              }}
            >
              <span>SAIR DA CONTA</span>
              <span style={{ color: "#77736b", fontSize: "14px" }}>↗</span>
            </button>

            <div style={{ padding: "18px", borderBottom: "1px solid #242424" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
                <div>
                  <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "7px" }}>
                    STATUS DE LEITURA
                  </div>
                  <div style={{ color: "#77736b", fontSize: "10px", lineHeight: "1.6" }}>
                    Permite mostrar quando suas mensagens foram lidas.
                  </div>
                </div>
                <button type="button" onClick={async () => {
                  const nextValue = !readReceiptsEnabled;
                  setReadReceiptsEnabled(nextValue);
                  setMessage("");
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const { error } = await supabase.from("profiles").update({ read_receipts_enabled: nextValue }).eq("id", user.id);
                  if (error) {
                    setReadReceiptsEnabled(!nextValue);
                    setMessage("Não foi possível atualizar o status de leitura.");
                    console.error("ERRO AO ATUALIZAR STATUS DE LEITURA:", error);
                  }
                }} style={{ minWidth: "112px", height: "38px", border: readReceiptsEnabled ? "1px solid #c9b58a" : "1px solid #292929", background: readReceiptsEnabled ? "#15130f" : "transparent", color: readReceiptsEnabled ? "#c9b58a" : "#77736b", fontSize: "9px", letterSpacing: "1.5px", cursor: "pointer" }}>
                  {readReceiptsEnabled ? "ATIVADO" : "DESATIVADO"}
                </button>
              </div>
            </div>

            <div
              style={{
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #242424",
              }}
            >
              <div>
                <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px" }}>
                  SONS DE NOTIFICAÇÃO
                </div>
                <div style={{ color: "#77736b", fontSize: "9px", marginTop: "5px" }}>
                  Curtidas e novas mensagens
                </div>
              </div>

              <button
                type="button"
                onClick={() => setNotificationSoundEnabled((current) => !current)}
                style={{
                  minWidth: "112px",
                  height: "38px",
                  border: notificationSoundEnabled ? "1px solid #c9b58a" : "1px solid #292929",
                  background: notificationSoundEnabled ? "#15130f" : "transparent",
                  color: notificationSoundEnabled ? "#c9b58a" : "#77736b",
                  fontSize: "9px",
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                }}
              >
                {notificationSoundEnabled ? "ATIVADO" : "DESATIVADO"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setChangePasswordOpen(true);
                setMessage("");
              }}
              style={{
                width: "100%",
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "none",
                borderBottom: "1px solid #242424",
                background: "transparent",
                color: "#f4ead7",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "1.8px",
              }}
            >
              <span>ALTERAR SENHA</span>
              <span style={{ color: "#77736b", fontSize: "14px" }}>›</span>
            </button>

            <div style={{ padding: "18px" }}>
              <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "7px" }}>
                USUÁRIOS BLOQUEADOS
              </div>
              <div style={{ color: "#77736b", fontSize: "10px", lineHeight: "1.6", marginBottom: "14px" }}>
                Veja e desbloqueie pessoas que você bloqueou.
              </div>

              {blockedUsersLoading ? (
                <div style={{ color: "#77736b", fontSize: "10px", letterSpacing: "1px" }}>
                  CARREGANDO...
                </div>
              ) : blockedUsers.length === 0 ? (
                <div style={{ color: "#55524d", fontSize: "10px", letterSpacing: "1px" }}>
                  NENHUM USUÁRIO BLOQUEADO
                </div>
              ) : (
                <div style={{ display: "grid", gap: "8px" }}>
                  {blockedUsers.map((blockedUser) => {
                    const birthDate = blockedUser.birth_date ? new Date(`${blockedUser.birth_date}T00:00:00`) : null;
                    const age = birthDate ? Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;

                    return (
                      <div
                        key={blockedUser.id}
                        style={{
                          minHeight: "52px",
                          padding: "0 12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          border: "1px solid #242424",
                          background: "#090909",
                        }}
                      >
                        <div>
                          <div style={{ color: "#f4ead7", fontSize: "11px", letterSpacing: "1px" }}>
                            {blockedUser.name || "Usuário"}{age ? `, ${age}` : ""}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUnblock(blockedUser)}
                          style={{
                            minWidth: "104px",
                            height: "34px",
                            border: "1px solid #c9b58a",
                            background: "transparent",
                            color: "#c9b58a",
                            fontSize: "8px",
                            letterSpacing: "1.4px",
                            cursor: "pointer",
                          }}
                        >
                          DESBLOQUEAR
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: "18px", border: "1px solid #2b1b1b", background: "#0b0b0b" }}>
            <button
              type="button"
              onClick={() => { setDeleteAccountOpen(true); setMessage(""); }}
              style={{
                width: "100%",
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "none",
                background: "transparent",
                color: "#b98989",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "1.8px",
              }}
            >
              <span>EXCLUIR MINHA CONTA</span>
              <span style={{ fontSize: "14px" }}>×</span>
            </button>
          </div>

          {changePasswordOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(0,0,0,0.82)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => { if (!changePasswordLoading) setChangePasswordOpen(false); }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  padding: "28px",
                  border: "1px solid #2d2922",
                  background: "#0b0b0b",
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <div style={{ color: "#f4ead7", fontSize: "14px", letterSpacing: "2px", marginBottom: "10px", textAlign: "center" }}>
                  ALTERAR SENHA
                </div>
                <p style={{ color: "#77736b", fontSize: "10px", lineHeight: "1.7", margin: "0 0 22px", textAlign: "center" }}>
                  Confirme sua senha atual e escolha uma nova senha para sua conta.
                </p>

                <div style={{ display: "grid", gap: "10px" }}>
                  <input
                    type="password"
                    placeholder="SENHA ATUAL"
                    value={changePasswordForm.currentPassword}
                    onChange={(event) => setChangePasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                    disabled={changePasswordLoading}
                    autoComplete="current-password"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <input
                    type="password"
                    placeholder="NOVA SENHA"
                    value={changePasswordForm.newPassword}
                    onChange={(event) => setChangePasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                    disabled={changePasswordLoading}
                    autoComplete="new-password"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <input
                    type="password"
                    placeholder="CONFIRMAR NOVA SENHA"
                    value={changePasswordForm.confirmPassword}
                    onChange={(event) => setChangePasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    disabled={changePasswordLoading}
                    autoComplete="new-password"
                    style={{ width: "100%", boxSizing: "border-box" }}
                  />
                  <div style={{ color: "#55524d", fontSize: "9px", lineHeight: "1.5", letterSpacing: "0.5px" }}>
                    A nova senha deve ter pelo menos 8 caracteres.
                  </div>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changePasswordLoading}
                    style={{
                      minHeight: "46px",
                      marginTop: "4px",
                      border: "1px solid #c9b58a",
                      background: "#15130f",
                      color: "#c9b58a",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: changePasswordLoading ? "wait" : "pointer",
                    }}
                  >
                    {changePasswordLoading ? "ALTERANDO..." : "ALTERAR SENHA"}
                  </button>
                  <button
                    type="button"
                    disabled={changePasswordLoading}
                    onClick={() => setChangePasswordOpen(false)}
                    style={{
                      minHeight: "46px",
                      border: "1px solid #292929",
                      background: "transparent",
                      color: "#77736b",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: changePasswordLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    CANCELAR
                  </button>
                </div>
              </div>
            </div>
          )}

          {deleteAccountOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: "rgba(0,0,0,0.82)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => { if (!deleteAccountLoading) setDeleteAccountOpen(false); }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  padding: "28px",
                  border: "1px solid #3a3030",
                  background: "#0b0b0b",
                  textAlign: "center",
                }}
                onClick={(event) => event.stopPropagation()}
              >
                <div style={{ color: "#f4ead7", fontSize: "14px", letterSpacing: "2px", marginBottom: "16px" }}>
                  EXCLUIR CONTA?
                </div>
                <p style={{ color: "#8a857c", fontSize: "11px", lineHeight: "1.7", margin: "0 0 24px" }}>
                  Essa ação é permanente. Seu perfil, fotos, curtidas, bloqueios, denúncias, conversas e demais dados vinculados à conta serão excluídos.
                </p>
                <div style={{ display: "grid", gap: "8px" }}>
                  <button
                    type="button"
                    disabled={deleteAccountLoading}
                    onClick={handleDeleteAccount}
                    style={{
                      minHeight: "46px",
                      border: "1px solid #8f5f5f",
                      background: "#171010",
                      color: "#c99a9a",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: deleteAccountLoading ? "wait" : "pointer",
                    }}
                  >
                    {deleteAccountLoading ? "EXCLUINDO..." : "SIM, EXCLUIR MINHA CONTA"}
                  </button>
                  <button
                    type="button"
                    disabled={deleteAccountLoading}
                    onClick={() => setDeleteAccountOpen(false)}
                    style={{
                      minHeight: "46px",
                      border: "1px solid #292929",
                      background: "transparent",
                      color: "#77736b",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: deleteAccountLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    CANCELAR
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: "18px", border: "1px solid #242424", background: "#0b0b0b" }}>
            <button
              type="button"
              onClick={() => { setLegalPage("terms"); setMessage(""); }}
              style={{
                width: "100%",
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "none",
                borderBottom: "1px solid #242424",
                background: "transparent",
                color: "#f4ead7",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "1.8px",
              }}
            >
              <span>TERMOS DE USO</span>
              <span style={{ color: "#77736b", fontSize: "14px" }}>›</span>
            </button>

            <button
              type="button"
              onClick={() => { setLegalPage("privacy"); setMessage(""); }}
              style={{
                width: "100%",
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "none",
                background: "transparent",
                color: "#f4ead7",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "1.8px",
              }}
            >
              <span>POLÍTICA DE PRIVACIDADE</span>
              <span style={{ color: "#77736b", fontSize: "14px" }}>›</span>
            </button>


            <button
              type="button"
              onClick={() => { setLegalPage("cookies"); setMessage(""); }}
              style={{
                width: "100%",
                minHeight: "58px",
                padding: "0 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "none",
                background: "transparent",
                color: "#f4ead7",
                cursor: "pointer",
                fontSize: "10px",
                letterSpacing: "1.8px",
              }}
            >
              <span>POLÍTICA DE COOKIES</span>
              <span style={{ color: "#77736b", fontSize: "14px" }}>›</span>
            </button>
          </div>

          {message && (
            <p className="form-subtitle" style={{ marginTop: "20px", textAlign: "center" }}>
              {message}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
            <button
              className="back-button"
              type="button"
              onClick={() => { setScreen("profile"); setMessage(""); }}
            >
              VOLTAR
            </button>
          </div>
        </section>
      )}

      {/* PERFIL */}

      {screen === "profile" && (
        <section
          style={{
            width: "100%",
            maxWidth: "700px",
            minHeight: "100vh",
            padding: "30px 20px 50px",
          }}
        >
          {!profileEditMode ? (
            <>
              <div style={{ textAlign: "center", marginBottom: "28px" }}>
                <div className="moon-logo">MOON</div>
                <p className="moon-tagline">FIND YOUR NIGHT.</p>
              </div>

              {(() => {
                const primaryPhoto = photos.find((photo) => photo.is_primary) || photos[0];
                return (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "430px",
                      margin: "0 auto",
                      border: "1px solid #242424",
                      background: "#0b0b0b",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "4 / 5",
                        background: "#101010",
                        overflow: "hidden",
                      }}
                    >
                      {primaryPhoto?.publicUrl ? (
                        <img
                          src={primaryPhoto.publicUrl}
                          alt={profileDisplayName || "Meu perfil"}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b3832", letterSpacing: "3px" }}>
                          MOON
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "22px" }}>
                      <div style={{ color: "#f4ead7", fontSize: "24px", letterSpacing: "1px" }}>
                        {profileDisplayName || "Seu nome"}{profileBirthDate ? `, ${calculateAge(profileBirthDate)}` : ""}
                      </div>

                      {profileForm.bio && (
                        <p style={{ color: "#aaa59b", fontSize: "13px", lineHeight: "1.7", margin: "20px 0 0" }}>
                          {profileForm.bio}
                        </p>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", marginTop: "22px", background: "#242424", border: "1px solid #242424" }}>
                        {profileForm.gender && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>IDENTIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.gender}</span></div>}
                        {profileForm.sexuality && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>SEXUALIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.sexuality}</span></div>}
                        {profileForm.position && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>POSIÇÃO</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.position}</span></div>}
                        {profileForm.availability && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>DISPONIBILIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.availability}</span></div>}
                      </div>

                      {activeBoost && boostSecondsLeft > 0 && (
                        <div style={{
                          marginTop: "22px",
                          padding: "16px 18px",
                          border: "1px solid rgba(201,181,138,.35)",
                          background: "linear-gradient(135deg, rgba(201,181,138,.07), rgba(201,181,138,.015))",
                          textAlign: "center",
                        }}>
                          <div style={{ color: "#c9b58a", fontSize: "8px", letterSpacing: "2px", marginBottom: "8px" }}>✦ BOOST ATIVO</div>
                          <div style={{ color: "#f4ead7", fontSize: "28px", letterSpacing: "3px", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                            {formatBoostTime(boostSecondsLeft)}
                          </div>
                          <div style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.4px", marginTop: "8px" }}>TEMPO RESTANTE</div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setProfileEditMode(true)}
                        style={{
                          marginTop: "22px",
                          width: "100%",
                          height: "48px",
                          background: "rgba(201, 181, 138, 0.04)",
                          border: "1px solid #c9b58a",
                          borderRadius: "2px",
                          color: "#c9b58a",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          fontWeight: "500",
                          cursor: "pointer",
                          boxShadow: "none"
                        }}
                      >
                        ✦ EDITAR PERFIL
                      </button>

                      <button
                        type="button"
                        onClick={() => { setScreen("settings"); setMessage(""); }}
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          height: "48px",
                          background: "transparent",
                          border: "1px solid #292929",
                          borderRadius: "2px",
                          color: "#77736b",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        ⚙ CONFIGURAÇÕES
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
                <button className="back-button" onClick={() => { setScreen("inside"); setMessage(""); }}>VOLTAR
                </button>
              </div>
            </>
          ) : (
            <section className="form-screen" style={{ minHeight: "auto", padding: "0" }}>
              <div className="moon-logo">MOON</div>
              <h1>Editar perfil</h1>
              <p className="form-subtitle">Atualize suas informações.</p>

              {/* FOTOS */}
              <div className="photo-section">
                <p className="photo-counter">FOTOS {photos.length}/3</p>
                <div className="photo-grid">
                  {photos.map((photo) => (
                    <div key={photo.id} className="photo-card">
                      <img src={photo.publicUrl} alt="Foto de perfil" />
                      {photo.is_primary && <span className="primary-label">PRINCIPAL</span>}
                      <button type="button" className="photo-star" onClick={() => handleSetPrimary(photo.id)} disabled={photoLoading || photo.is_primary}>★</button>
                      <button type="button" className="photo-delete" onClick={() => handleDeletePhoto(photo)} disabled={photoLoading}>×</button>
                    </div>
                  ))}
                </div>
                {photos.length < 3 && (
                  <>
                    <label className="moon-upload">
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} />
                      <span className="moon-upload-icon">＋</span>
                      <span className="moon-upload-text">{photoFile ? photoFile.name : "ADICIONAR FOTO"}</span>
                      <span className="moon-upload-subtext">JPG, PNG ou WEBP · até 10 MB</span>
                    </label>
                    {photoFile && <button type="button" onClick={handlePhotoUpload} disabled={photoLoading}>{photoLoading ? "ENVIANDO..." : "CONFIRMAR FOTO"}</button>}
                  </>
                )}
              </div>

              {/* LOCALIZAÇÃO */}
              <div className="photo-section" style={{ marginTop: "10px", marginBottom: "25px" }}>
                <p className="photo-counter">LOCALIZAÇÃO</p>
                <p className="form-subtitle" style={{ marginTop: "0", marginBottom: "15px" }}>A MOON usa sua localização para encontrar pessoas próximas. Sua cidade não precisa ser informada.</p>
                <button type="button" onClick={handleUseLocation} disabled={locationLoading}>
                  {locationLoading ? "LOCALIZANDO..." : locationSaved ? "ATUALIZAR LOCALIZAÇÃO" : "USAR MINHA LOCALIZAÇÃO"}
                </button>
                {locationSaved && <p className="form-subtitle" style={{ marginTop: "12px", marginBottom: "0", color: "#c9b58a" }}>✓ Localização salva</p>}
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>IDENTIDADE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {["Homem cis", "Homem trans", "Não binário"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, gender: option })} style={{ height: "44px", border: profileForm.gender === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.gender === option ? "#15130f" : "#0b0b0b", color: profileForm.gender === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "0.7px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>SEXUALIDADE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {["Gay", "Bissexual", "Pansexual", "Outra"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, sexuality: option })} style={{ height: "44px", border: profileForm.sexuality === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.sexuality === option ? "#15130f" : "#0b0b0b", color: profileForm.sexuality === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>POSIÇÃO</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {["Ativo", "Passivo", "Versátil"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, position: option })} style={{ height: "44px", border: profileForm.position === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.position === option ? "#15130f" : "#0b0b0b", color: profileForm.position === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>DISPONIBILIDADE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {["Agora", "Mais tarde", "Outro dia", "Só conversar"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, availability: option })} style={{ height: "44px", border: profileForm.availability === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.availability === option ? "#15130f" : "#0b0b0b", color: profileForm.availability === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <textarea
                  name="bio"
                  placeholder="Conte um pouco sobre você..."
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    resize: "vertical",
                    boxSizing: "border-box",
                    background: "rgba(201, 181, 138, 0.035)",
                    border: "1px solid #292929",
                    borderRadius: "2px",
                    color: "#f4ead7",
                    padding: "16px",
                    outline: "none",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    lineHeight: "1.7",
                    letterSpacing: "0.2px",
                    boxShadow: "none"
                  }}
                />
                <button type="submit" disabled={loading || !profileForm.gender || !profileForm.sexuality || !profileForm.position || !profileForm.availability}>{loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}</button>
              </form>

              {message && <p className="form-subtitle">{message}</p>}

              <button className="back-button" onClick={() => setProfileEditMode(false)}>CANCELAR</button>
            </section>
          )}
        </section>
      )}

            {/* CURTIDAS */}

      {screen === "likes" && (
        <section
          style={{
            width: "100%",
            maxWidth: "700px",
            minHeight: "100vh",
            padding: "30px 20px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "35px" }}>
            <div className="moon-logo">MOON</div>
            <p className="moon-tagline">FIND YOUR NIGHT.</p>
            <p style={{ color: "#77736b", fontSize: "11px", letterSpacing: "2px", marginTop: "20px" }}>
              CURTIDAS
            </p>
          </div>

          {likesLoading ? (
            <div style={{ textAlign: "center", padding: "70px 20px", color: "#77736b", letterSpacing: "2px", fontSize: "11px" }}>
              CARREGANDO CURTIDAS...
            </div>
          ) : likedProfiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px", border: "1px solid #191919", background: "#0b0b0b" }}>
              <p style={{ color: "#f4ead7", fontSize: "18px", letterSpacing: "3px", marginBottom: "15px" }}>
                NENHUMA CURTIDA
              </p>
              <p style={{ color: "#77736b", fontSize: "12px", lineHeight: "1.7", maxWidth: "400px", margin: "0 auto" }}>
                Aqui aparecem as pessoas que curtiram você.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {likedProfiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleChat(profile, "likes")}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "12px",
                    border: "1px solid #202020", background: "#0b0b0b", color: "#f4ead7", cursor: "pointer", textAlign: "left"
                  }}
                >
                  <div style={{ width: "58px", height: "58px", flexShrink: 0, overflow: "hidden", background: "#101010", border: "1px solid #292929" }}>
                    {profile.photoUrl ? (
                      <img src={profile.photoUrl} alt={profile.name || "Perfil MOON"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b3832", fontSize: "9px", letterSpacing: "1px" }}>MOON</div>
                    )}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: "#f4ead7", fontSize: "14px", letterSpacing: "1px" }}>
                      {profile.name || "Sem nome"}{profile.birth_date ? `, ${calculateAge(profile.birth_date)}` : ""}
                    </div>
                  </div>
                  <span style={{ color: "#c9b58a", fontSize: "18px" }}>›</span>
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", marginTop: "35px" }}>
            <button className="back-button" onClick={() => { setScreen("inside"); setMessage(""); }}>VOLTAR</button>
          </div>
        </section>
      )}

      {/* CONVERSAS */}

      {screen === "conversations" && (
        <section
          style={{
            width: "100%",
            maxWidth: "700px",
            minHeight: "100vh",
            padding: "30px 20px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "35px",
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
                color: "#77736b",
                fontSize: "11px",
                letterSpacing: "2px",
                marginTop: "20px",
              }}
            >
              CONVERSAS
            </p>
          </div>

          {conversationsLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "70px 20px",
                color: "#77736b",
                letterSpacing: "2px",
                fontSize: "11px",
              }}
            >
              CARREGANDO CONVERSAS...
            </div>
          ) : conversations.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "70px 20px",
                border: "1px solid #191919",
                background: "#0b0b0b",
              }}
            >
              <p
                style={{
                  color: "#f4ead7",
                  fontSize: "18px",
                  letterSpacing: "3px",
                  marginBottom: "15px",
                }}
              >
                NENHUMA CONVERSA
              </p>

              <p
                style={{
                  color: "#77736b",
                  fontSize: "12px",
                  lineHeight: "1.7",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                Quando você iniciar uma conversa,
                ela aparecerá aqui.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {conversations.map((conversation) => {
                const profile = conversation.profile;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      handleChat(profile, "conversations")
                    }
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px",
                      border: "1px solid #202020",
                      background: "#0b0b0b",
                      color: "#f4ead7",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        flexShrink: 0,
                        overflow: "hidden",
                        background: "#101010",
                        border: "1px solid #292929",
                      }}
                    >
                      {conversation.photoUrl ? (
                        <img
                          src={conversation.photoUrl}
                          alt={profile.name || "Perfil MOON"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#3b3832",
                            fontSize: "9px",
                            letterSpacing: "1px",
                          }}
                        >
                          MOON
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            color: "#f4ead7",
                            fontSize: "14px",
                            letterSpacing: "1px",
                          }}
                        >
                          {profile.name || "Sem nome"}
                        </span>

                        {profile.birth_date && (
                          <span
                            style={{
                              color: "#c9b58a",
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {calculateAge(profile.birth_date)}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          color: "#77736b",
                          fontSize: "10px",
                          marginTop: "6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conversation.lastMessage?.content ||
                          "Inicie a conversa"}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                      }}
                    >
                      {conversation.unreadCount > 0 && (
                        <span
                          style={{
                            minWidth: "20px",
                            height: "20px",
                            padding: "0 6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "999px",
                            background: "#c9b58a",
                            color: "#0b0b0b",
                            fontSize: "10px",
                            fontWeight: 700,
                            lineHeight: 1,
                          }}
                        >
                          {conversation.unreadCount > 99
                            ? "99+"
                            : conversation.unreadCount}
                        </span>
                      )}

                      <span
                        style={{
                          color: "#c9b58a",
                          fontSize: "18px",
                        }}
                      >
                        ›
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {message && (
            <p
              style={{
                textAlign: "center",
                color: "#c9b58a",
                fontSize: "11px",
                marginTop: "20px",
              }}
            >
              {message}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "35px",
            }}
          >
            <button
              className="back-button"
              onClick={() => {
                setScreen("inside");
                setMessage("");
              }}
            >
              VOLTAR
            </button>
          </div>
        </section>
      )}

      {/* CHAT */}

      {screen === "chat" && (
        <section
          style={{
            width: "100%",
            maxWidth: "700px",
            minHeight: "100vh",
            padding: "30px 20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "14px 0 20px",
              borderBottom: "1px solid #202020",
              background: "#050505",
            }}
          >
            <button
              type="button"
              className="back-button"
              onClick={() => {
                setShowChatMenu(false);
                setScreen(chatOrigin);
                setChatTarget(null);
                setChatConversation(null);
                setChatMessages([]);
                setChatText("");
                setShowChatMenu(false);
                setMessage("");
              }}
              style={{
                marginTop: 0,
                marginRight: "auto",
              }}
            >
              VOLTAR
            </button>

            <div
              style={{
                textAlign: "center",
                flex: 1,
              }}
            >
              <div
                style={{
                  color: "#f4ead7",
                  fontSize: "18px",
                  letterSpacing: "2px",
                }}
              >
                {chatTarget?.name || "CONVERSA"}
              </div>
              {chatTarget?.city && (
                <div
                  style={{
                    color: "#77736b",
                    fontSize: "9px",
                    letterSpacing: "1.5px",
                    marginTop: "5px",
                  }}
                >
                </div>
              )}
            </div>

            <div
              style={{
                width: "62px",
                position: "relative",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowChatMenu((value) => !value)}
                aria-label="Opções da conversa"
                style={{
                  width: "42px",
                  height: "38px",
                  border: "1px solid #292929",
                  background: "transparent",
                  color: "#c9b58a",
                  cursor: "pointer",
                  fontSize: "20px",
                  lineHeight: "1",
                }}
              >
                ⋮
              </button>

              {showChatMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "46px",
                    right: 0,
                    width: "190px",
                    background: "#0b0b0b",
                    border: "1px solid #292929",
                    boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
                    zIndex: 50,
                    padding: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowChatMenu(false);
                      handleBlock(chatTarget);
                    }}
                    style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                  >
                    🚫 &nbsp; BLOQUEAR USUÁRIO
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowChatMenu(false);
                      setReportTarget(chatTarget);
                      setReportReason("");
                      setMessage("");
                    }}
                    style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                  >
                    ⚠️ &nbsp; DENUNCIAR USUÁRIO
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowChatMenu(false);
                      setMessage("Suas conversas e dados de perfil seguem as configurações de privacidade da MOON.");
                    }}
                    style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                  >
                    🔒 &nbsp; PRIVACIDADE
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            ref={chatMessagesContainerRef}
            style={{
              flex: 1,
              minHeight: 0,
              height: "55vh",
              padding: "25px 0",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              overflowY: "auto",
            }}
          >
            {chatMessages.length === 0 ? (
              <div
                style={{
                  margin: "auto",
                  textAlign: "center",
                  color: "#77736b",
                  fontSize: "11px",
                  letterSpacing: "1px",
                }}
              >
                INÍCIO DA CONVERSA
              </div>
            ) : (
              chatMessages.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  style={{
                    alignSelf:
                      chatMessage.sender_id === currentUserId
                        ? "flex-end"
                        : "flex-start",
                    maxWidth: "75%",
                    padding: "11px 14px",
                    border: "1px solid #292929",
                    background:
                      chatMessage.sender_id === currentUserId
                        ? "#c9b58a"
                        : "#0b0b0b",
                    color:
                      chatMessage.sender_id === currentUserId
                        ? "#050505"
                        : "#f4ead7",
                    fontSize: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  <div>{chatMessage.content}</div>
                  {chatMessage.sender_id === currentUserId && (
                    <div style={{ marginTop: "5px", textAlign: "right", fontSize: "9px", letterSpacing: "0.5px", opacity: 0.7 }}>
                      {chatMessage.read_at ? "✓✓" : "✓"}
                    </div>
                  )}
                </div>
              ))
            )}
            <div
              ref={chatMessagesBottomRef}
              style={{
                height: "1px",
                flexShrink: 0,
              }}
            />
          </div>

          <form
            onSubmit={handleSendMessage}
            style={{
              display: "flex",
              gap: "8px",
              borderTop: "1px solid #202020",
              paddingTop: "18px",
            }}
          >
            <input
              type="text"
              value={chatText}
              onChange={(event) =>
                setChatText(event.target.value)
              }
              placeholder="Escreva uma mensagem..."
              style={{
                flex: 1,
                height: "48px",
                padding: "0 14px",
                border: "1px solid #292929",
                background: "#0b0b0b",
                color: "#f4ead7",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={!chatText.trim()}
              style={{
                width: "58px",
                height: "48px",
                border: "1px solid #c9b58a",
                background: "transparent",
                color: "#f4ead7",
                cursor: chatText.trim()
                  ? "pointer"
                  : "not-allowed",
                opacity: chatText.trim()
                  ? 1
                  : 0.45,
                fontSize: "18px",
              }}
            >
              ↑
            </button>
          </form>

          {message && (
            <p
              style={{
                textAlign: "center",
                color: "#c9b58a",
                fontSize: "11px",
                marginTop: "15px",
              }}
            >
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

          {/* AÇÕES RÁPIDAS */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={refreshDiscovery}
              disabled={discoveryLoading}
              title="Atualizar Discovery"
              style={{
                width: "42px",
                height: "34px",
                border: "1px solid #292929",
                background: "#0b0b0b",
                color: "#c9b58a",
                fontSize: "15px",
                cursor: "pointer",
                opacity: discoveryLoading ? 0.55 : 1,
              }}
            >
              ↻
            </button>

            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locationLoading}
              title="Atualizar localização"
              style={{
                width: "42px",
                height: "34px",
                border: "1px solid #292929",
                background: "#0b0b0b",
                color: "#c9b58a",
                fontSize: "14px",
                cursor: "pointer",
                opacity: locationLoading ? 0.55 : 1,
              }}
            >
              ⌖
            </button>


            <span
              style={{
                color: "#555149",
                fontSize: "9px",
                letterSpacing: "1.5px",
                marginLeft: "3px",
              }}
            >
              {discoveryLoading ? "ATUALIZANDO" : locationLoading ? "LOCALIZANDO" : "50 KM"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setBoostOpen(true);
              setMessage("");
            }}
            title={activeBoost ? "Boost ativo" : "Ativar Boost"}
            style={{
              position: "fixed",
              right: "18px",
              bottom: "92px",
              zIndex: 900,
              minWidth: activeBoost ? "132px" : "104px",
              height: activeBoost ? "52px" : "42px",
              padding: "0 14px",
              border: "1px solid #c9b58a",
              background: "#0b0b0b",
              color: "#c9b58a",
              fontSize: "9px",
              letterSpacing: "1.4px",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
            }}
          >
            {activeBoost ? (
              <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                <span style={{ fontSize: "8px", letterSpacing: "1.6px" }}>✦ BOOST ATIVO</span>
                <span style={{ fontSize: "15px", letterSpacing: "1.5px", lineHeight: 1 }}>{formatBoostTime(boostSecondsLeft)}</span>
              </span>
            ) : (
              "⚡ BOOST"
            )}
          </button>

          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
              marginBottom: "16px",
              scrollbarWidth: "none",
              justifyContent: "center",
            }}
          >
            {[
              ["IDADE", () => setShowAgeFilter((value) => !value), minAge !== 18 || maxAge !== 65 ? `${minAge}-${maxAge >= 65 ? "65+" : maxAge}` : ""],
              ["IDENTIDADE", () => setShowIdentityFilter((value) => !value), identityFilter],
              ["SEXUALIDADE", () => setShowSexualityFilter((value) => !value), sexualityFilter],
              ["POSIÇÃO", () => setShowPositionFilter((value) => !value), positionFilter],
              ["DISPONIBILIDADE", () => setShowAvailabilityFilter((value) => !value), availabilityFilter],
            ].map(([label, onClick, activeValue]) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setMessage("");
                  onClick();
                }}
                style={{
                  flex: "0 0 auto",
                  minWidth: "105px",
                  height: "36px",
                  padding: "0 12px",
                  background: "#0b0b0b",
                  border: "1px solid #292929",
                  color: activeValue ? "#f4ead7" : "#c9b58a",
                  fontSize: "8px",
                  letterSpacing: "1.4px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {label}{activeValue ? ` · ${activeValue}` : ""}
              </button>
            ))}
          </div>

          {/* FILTRO DE IDADE */}
          {showAgeFilter && (
            <div
              style={{
                maxWidth: "520px",
                margin: "0 auto 18px",
                padding: "20px",
                border: "1px solid #292929",
                background: "#0b0b0b",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <span style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px" }}>IDADE</span>
                <span style={{ color: "#f4ead7", fontSize: "13px" }}>{minAge} - {maxAge >= 65 ? "65+" : maxAge}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <label style={{ color: "#77736b", fontSize: "9px", letterSpacing: "1.5px" }}>
                  MÍNIMO
                  <select value={minAge} onChange={(e) => { const value = Number(e.target.value); setMinAge(value); if (value > maxAge) setMaxAge(value); }} style={{ width: "100%", marginTop: "7px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "11px", outline: "none" }}>
                    {Array.from({ length: 48 }, (_, i) => i + 18).map((age) => <option key={age} value={age}>{age} anos</option>)}
                  </select>
                </label>
                <label style={{ color: "#77736b", fontSize: "9px", letterSpacing: "1.5px" }}>
                  MÁXIMO
                  <select value={maxAge} onChange={(e) => { const value = Number(e.target.value); setMaxAge(value); if (value < minAge) setMinAge(value); }} style={{ width: "100%", marginTop: "7px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "11px", outline: "none" }}>
                    {Array.from({ length: 48 }, (_, i) => i + 18).map((age) => <option key={age} value={age}>{age === 65 ? "65+" : `${age} anos`}</option>)}
                  </select>
                </label>
              </div>
              <button type="button" onClick={() => setShowAgeFilter(false)} style={{ marginTop: "18px", width: "100%", background: "transparent", border: "1px solid #6f5c36", color: "#c9b58a", padding: "11px", fontSize: "10px", letterSpacing: "1.8px", cursor: "pointer" }}>APLICAR FILTRO</button>
            </div>
          )}

          {/* FILTRO DE IDENTIDADE */}
          {showIdentityFilter && (
            <div style={{ maxWidth: "520px", margin: "0 auto 18px", padding: "18px", border: "1px solid #292929", background: "#0b0b0b" }}>
              <div style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", marginBottom: "12px" }}>IDENTIDADE</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Homem cis", "Homem trans", "Não binário"].map((option) => (
                  <button key={option} type="button" onClick={() => setIdentityFilter(identityFilter === option ? "" : option)} style={{ height: "44px", border: identityFilter === option ? "1px solid #c9b58a" : "1px solid #292929", background: identityFilter === option ? "#15130f" : "#0b0b0b", color: identityFilter === option ? "#f4ead7" : "#77736b", fontSize: "9px", letterSpacing: "0.7px", cursor: "pointer" }}>{option}</button>
                ))}
              </div>
            </div>
          )}

          {/* FILTRO DE SEXUALIDADE */}
          {showSexualityFilter && (
            <div style={{ maxWidth: "520px", margin: "0 auto 18px", padding: "18px", border: "1px solid #292929", background: "#0b0b0b" }}>
              <div style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", marginBottom: "12px" }}>SEXUALIDADE</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {["Gay", "Bissexual", "Pansexual", "Outra"].map((option) => (
                  <button key={option} type="button" onClick={() => setSexualityFilter(sexualityFilter === option ? "" : option)} style={{ height: "44px", border: sexualityFilter === option ? "1px solid #c9b58a" : "1px solid #292929", background: sexualityFilter === option ? "#15130f" : "#0b0b0b", color: sexualityFilter === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                ))}
              </div>
            </div>
          )}

          {/* FILTRO DE POSIÇÃO */}
          {showPositionFilter && (
            <div style={{ maxWidth: "520px", margin: "0 auto 18px", padding: "18px", border: "1px solid #292929", background: "#0b0b0b" }}>
              <div style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", marginBottom: "12px" }}>POSIÇÃO</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Ativo", "Passivo", "Versátil"].map((option) => (
                  <button key={option} type="button" onClick={() => setPositionFilter(positionFilter === option ? "" : option)} style={{ height: "44px", border: positionFilter === option ? "1px solid #c9b58a" : "1px solid #292929", background: positionFilter === option ? "#15130f" : "#0b0b0b", color: positionFilter === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                ))}
              </div>
            </div>
          )}

          {showAvailabilityFilter && (
            <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "8px" }}>
              {["Agora", "Mais tarde", "Outro dia", "Só conversar"].map((option) => (
                <button key={option} type="button" onClick={() => setAvailabilityFilter(availabilityFilter === option ? "" : option)} style={{ height: "44px", border: availabilityFilter === option ? "1px solid #c9b58a" : "1px solid #292929", background: availabilityFilter === option ? "#15130f" : "#0b0b0b", color: availabilityFilter === option ? "#f4ead7" : "#77736b", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
              ))}
            </div>
          )}

          <style>{`
            .moon-discovery-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 8px;
            }
            .moon-discovery-card-info {
              padding: 10px;
            }
            .moon-discovery-name {
              font-size: 12px !important;
              letter-spacing: 0.5px !important;
            }
            .moon-discovery-distance {
              font-size: 8px !important;
            }
            .moon-discovery-bio {
              display: none !important;
            }
            .moon-discovery-actions {
              gap: 5px !important;
              margin-top: 9px !important;
            }
            .moon-discovery-actions button {
              height: 34px !important;
              font-size: 14px !important;
              letter-spacing: 0 !important;
            }
            @media (min-width: 700px) {
              .moon-discovery-grid {
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 18px;
              }
              .moon-discovery-card-info {
                padding: 16px;
              }
              .moon-discovery-name {
                font-size: 17px !important;
                letter-spacing: 1px !important;
              }
              .moon-discovery-distance {
                font-size: 10px !important;
              }
              .moon-discovery-bio {
                display: -webkit-box !important;
              }
              .moon-discovery-actions {
                gap: 8px !important;
                margin-top: 14px !important;
              }
              .moon-discovery-actions button {
                height: 42px !important;
                font-size: 18px !important;
                letter-spacing: 2px !important;
              }
            }
          `}</style>

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

              {nearbyProfiles
                .filter((profile) => {
                  const age = calculateAge(profile.birth_date);
                  const matchesAge = age >= minAge && age <= maxAge;
                  const matchesIdentity = !identityFilter || profile.gender === identityFilter;
                  const matchesSexuality = !sexualityFilter || profile.sexuality === sexualityFilter;
                  const matchesPosition = !positionFilter || profile.position === positionFilter;
                  const matchesAvailability = !availabilityFilter || profile.availability === availabilityFilter;
                  return matchesAge && matchesIdentity && matchesSexuality && matchesPosition && matchesAvailability;
                })
                .flatMap((profile, profileIndex) => {
                  const status = getOnlineStatus(profile.last_active_at);

                  const profileCard = (
                    <article
                      key={
                        profile.id
                      }
                      onClick={() => openProfileDetails(profile)}
                      style={{
                        background:
                          "#0b0b0b",
                        border:
                          profile.is_boosted ? "1px solid #c9b58a" : "1px solid #202020",
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

                        {profile.is_boosted && (
                          <span
                            style={{
                              position: "absolute",
                              top: "10px",
                              left: "10px",
                              zIndex: 2,
                              background: "rgba(5,5,5,0.92)",
                              border: "1px solid #c9b58a",
                              color: "#c9b58a",
                              padding: "6px 9px",
                              fontSize: "8px",
                              letterSpacing: "1.6px",
                            }}
                          >
                            ✦ EM DESTAQUE
                          </span>
                        )}

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

                        <div
  style={{
    display: "flex",
    gap: "8px",
    width: "100%",
    marginTop: "14px",
  }}
>
  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      handleLike(profile.id);
    }}
    style={{
      flex: 1,
      height: "42px",
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

  <button
    type="button"
    onClick={(event) => {
      event.stopPropagation();
      handleChat(profile, "inside");
    }}
    disabled={chatLoading}
    style={{
      flex: 1,
      height: "42px",
      border: "1px solid #c9b58a",
      background: "transparent",
      color: "#f4ead7",
      cursor: chatLoading ? "wait" : "pointer",
      fontSize: "18px",
      letterSpacing: "2px",
      transition: "all 0.25s ease",
      opacity: chatLoading ? 0.6 : 1,
    }}
    onMouseEnter={(event) => {
      if (!chatLoading) {
        event.currentTarget.style.background =
          "#c9b58a";
        event.currentTarget.style.color =
          "#050505";
      }
    }}
    onMouseLeave={(event) => {
      event.currentTarget.style.background =
        "transparent";
      event.currentTarget.style.color =
        "#f4ead7";
    }}
    aria-label={`Conversar com ${
      profile.name || "perfil"
    }`}
    title="Conversar"
  >
    💬
  </button>
</div>

<button
  type="button"
  onClick={(event) => {
    event.stopPropagation();
    handleBlock(profile);
  }}
  style={{
    width: "100%",
    marginTop: "8px",
    height: "28px",
    border: "1px solid #292929",
    background: "transparent",
    color: "#77736b",
    cursor: "pointer",
    fontSize: "8px",
    letterSpacing: "1.5px",
  }}
>
  BLOQUEAR
</button>

<button
  type="button"
  onClick={(event) => {
    event.stopPropagation();
    setReportTarget(profile);
    setReportReason("");
    setMessage("");
  }}
  style={{
    width: "100%",
    marginTop: "6px",
    height: "28px",
    border: "1px solid #292929",
    background: "transparent",
    color: "#77736b",
    cursor: "pointer",
    fontSize: "8px",
    letterSpacing: "1.5px",
  }}
>
  DENUNCIAR
</button>

                      </div>

                    </article>
                  );

                  const filteredProfileCount = nearbyProfiles.filter((candidate) => {
                    const age = calculateAge(candidate.birth_date);
                    const matchesAge = age >= minAge && age <= maxAge;
                    const matchesIdentity = !identityFilter || candidate.gender === identityFilter;
                    const matchesSexuality = !sexualityFilter || candidate.sexuality === sexualityFilter;
                    const matchesPosition = !positionFilter || candidate.position === positionFilter;
                    const matchesAvailability = !availabilityFilter || candidate.availability === availabilityFilter;
                    return matchesAge && matchesIdentity && matchesSexuality && matchesPosition && matchesAvailability;
                  }).length;

                  const isLastProfile = profileIndex === filteredProfileCount - 1;

                  const adsForSlot = activeAdvertisements.filter((advertisement) => {
                    const frequency = Math.max(1, Number(advertisement.display_frequency) || 8);
                    const reachedFrequency = (profileIndex + 1) % frequency === 0;
                    const needsFallback = isLastProfile && filteredProfileCount < frequency;
                    return reachedFrequency || needsFallback;
                  });

                  return [
                    profileCard,
                    ...adsForSlot.map((advertisement) => (
                      <article
                        key={`advertisement-${advertisement.id}-${profileIndex}`}
                        style={{
                          background: "#0b0b0b",
                          border: "1px solid rgba(214, 185, 125, 0.34)",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            background: "#101010",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {advertisement.image_url ? (
                            <img
                              src={advertisement.image_url}
                              alt={advertisement.company_name || "Publicidade MOON"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#3b3832",
                                fontSize: "30px",
                                letterSpacing: "4px",
                              }}
                            >
                              MOON
                            </div>
                          )}

                          <span
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "10px",
                              background: "#050505",
                              border: "1px solid #c9b58a",
                              color: "#c9b58a",
                              padding: "5px 8px",
                              fontSize: "8px",
                              letterSpacing: "1.5px",
                            }}
                          >
                            PUBLICIDADE
                          </span>
                        </div>

                        <div style={{ padding: "16px" }}>
                          <div
                            style={{
                              color: "#c9b58a",
                              fontSize: "9px",
                              letterSpacing: "1.5px",
                              marginBottom: "7px",
                            }}
                          >
                            {advertisement.company_name}
                          </div>

                          <h2
                            style={{
                              margin: 0,
                              color: "#f4ead7",
                              fontSize: "17px",
                              fontWeight: "400",
                              letterSpacing: "1px",
                            }}
                          >
                            {advertisement.title}
                          </h2>

                          {advertisement.description && (
                            <p
                              style={{
                                margin: "10px 0 0",
                                color: "#8e877c",
                                fontSize: "11px",
                                lineHeight: "1.5",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {advertisement.description}
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!advertisement.destination_url) return;
                              try {
                                const url = new URL(advertisement.destination_url);
                                if (["http:", "https:"].includes(url.protocol)) {
                                  window.open(url.href, "_blank", "noopener,noreferrer");
                                }
                              } catch {
                                setMessage("O link desta publicidade é inválido.");
                              }
                            }}
                            disabled={!advertisement.destination_url}
                            style={{
                              width: "100%",
                              marginTop: "14px",
                              minHeight: "42px",
                              border: "1px solid rgba(214, 185, 125, 0.30)",
                              background: "rgba(214, 185, 125, 0.05)",
                              color: "#d6b97d",
                              fontSize: "9px",
                              fontWeight: 600,
                              letterSpacing: "1.5px",
                              cursor: advertisement.destination_url ? "pointer" : "default",
                              opacity: advertisement.destination_url ? 1 : 0.5,
                            }}
                          >
                            {advertisement.cta_text || "SAIBA MAIS"} ↗
                          </button>
                        </div>
                      </article>
                    )),
                  ];
                })
              }

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

          {selectedProfile && (
            <div
              onClick={() => setSelectedProfile(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "rgba(0,0,0,0.88)",
                backdropFilter: "blur(10px)",
                overflowY: "auto",
              }}
            >
              <div
                onClick={(event) => event.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: "560px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  background: "#080808",
                  border: "1px solid #292929",
                  padding: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "2px" }}>PERFIL MOON</div>
                  <div style={{ position: "relative", display: "flex", gap: "7px", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => setShowSelectedProfileMenu((value) => !value)}
                      aria-label="Opções do perfil"
                      style={{ width: "34px", height: "34px", border: "1px solid #292929", background: "transparent", color: "#c9b58a", cursor: "pointer", fontSize: "18px", lineHeight: "1" }}
                    >
                      ⋮
                    </button>

                    {showSelectedProfileMenu && (
                      <div
                        style={{
                          position: "absolute",
                          top: "40px",
                          right: "42px",
                          width: "190px",
                          background: "#0b0b0b",
                          border: "1px solid #292929",
                          boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
                          zIndex: 60,
                          padding: "6px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setShowSelectedProfileMenu(false);
                            handleBlock(selectedProfile);
                          }}
                          style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                        >
                          🚫 &nbsp; BLOQUEAR USUÁRIO
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowSelectedProfileMenu(false);
                            setReportTarget(selectedProfile);
                            setReportReason("");
                            setMessage("");
                          }}
                          style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                        >
                          ⚠️ &nbsp; DENUNCIAR USUÁRIO
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowSelectedProfileMenu(false);
                            setLegalPage("privacy");
                            setSelectedProfile(null);
                          }}
                          style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                        >
                          🔒 &nbsp; PRIVACIDADE
                        </button>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => { setShowSelectedProfileMenu(false); setSelectedProfile(null); }}
                      style={{ width: "34px", height: "34px", border: "1px solid #292929", background: "transparent", color: "#c9b58a", cursor: "pointer", fontSize: "15px" }}
                    >
                      ×
                    </button>
                  </div>
                </div>

                {selectedProfileLoading ? (
                  <div style={{ textAlign: "center", padding: "50px 20px", color: "#77736b", fontSize: "10px", letterSpacing: "2px" }}>
                    CARREGANDO PERFIL...
                  </div>
                ) : (
                  <>
                    {selectedProfilePhotos.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: selectedProfilePhotos.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: "6px", marginBottom: "18px" }}>
                        {selectedProfilePhotos.map((photo) => (
                          <img
                            key={photo.id}
                            src={photo.publicUrl}
                            alt={selectedProfile.name || "Perfil MOON"}
                            style={{ width: "100%", aspectRatio: selectedProfilePhotos.length === 1 ? "1 / 1" : "1 / 1", objectFit: "cover", display: "block" }}
                          />
                        ))}
                      </div>
                    )}

                    <div style={{ marginBottom: "18px" }}>
                      <h2 style={{ margin: 0, color: "#f4ead7", fontSize: "24px", fontWeight: "400", letterSpacing: "1px" }}>
                        {selectedProfile.name || "Sem nome"}{selectedProfile.birth_date ? `, ${calculateAge(selectedProfile.birth_date)}` : ""}
                      </h2>
                      <div style={{ color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginTop: "7px" }}>
                        {getOnlineStatus(selectedProfile.last_active_at) || "OFFLINE"}
                        {selectedProfile.distance_km !== undefined && selectedProfile.distance_km !== null ? ` · ${formatDistance(selectedProfile.distance_km)}` : ""}
                      </div>
                      {selectedProfile.is_boosted && (
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            marginTop: "12px",
                            padding: "7px 10px",
                            border: "1px solid #c9b58a",
                            color: "#c9b58a",
                            fontSize: "8px",
                            letterSpacing: "1.7px",
                          }}
                        >
                          ✦ EM DESTAQUE
                        </div>
                      )}
                    </div>

                    {selectedProfile.bio && (
                      <div style={{ border: "1px solid #202020", background: "#0b0b0b", padding: "16px", marginBottom: "8px" }}>
                        <span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "8px" }}>SOBRE VOCÊ</span>
                        <p style={{ margin: 0, color: "#e9dfcd", fontSize: "12px", lineHeight: "1.7" }}>{selectedProfile.bio}</p>
                      </div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px", marginBottom: "18px" }}>
                      {selectedProfile.gender && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>IDENTIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.gender}</span></div>}
                      {selectedProfile.sexuality && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>SEXUALIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.sexuality}</span></div>}
                      {selectedProfile.position && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>POSIÇÃO</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.position}</span></div>}
                      {selectedProfile.availability && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>DISPONIBILIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.availability}</span></div>}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button type="button" onClick={() => { handleLike(selectedProfile.id); }} style={{ flex: 1, height: "44px", border: "1px solid #c9b58a", background: "transparent", color: "#f4ead7", cursor: "pointer", fontSize: "17px" }}>♥</button>
                      <button type="button" onClick={() => { setSelectedProfile(null); handleChat(selectedProfile, "inside"); }} style={{ flex: 1, height: "44px", border: "1px solid #c9b58a", background: "transparent", color: "#f4ead7", cursor: "pointer", fontSize: "17px" }}>💬</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {reportTarget && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "rgba(0,0,0,0.82)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "430px",
                  padding: "24px",
                  background: "#0b0b0b",
                  border: "1px solid #292929",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#f4ead7",
                    fontSize: "16px",
                    letterSpacing: "2px",
                  }}
                >
                  DENUNCIAR PERFIL
                </p>

                <p
                  style={{
                    margin: "0 0 20px",
                    color: "#77736b",
                    fontSize: "11px",
                    lineHeight: "1.6",
                  }}
                >
                  Por que você quer denunciar {reportTarget.name || "este perfil"}?
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {[
                    "Perfil falso",
                    "Conteúdo inadequado",
                    "Assédio ou comportamento abusivo",
                    "Spam ou publicidade",
                    "Outro motivo",
                  ].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setReportReason(reason)}
                      style={{
                        width: "100%",
                        minHeight: "42px",
                        padding: "10px 12px",
                        textAlign: "left",
                        border: reportReason === reason
                          ? "1px solid #c9b58a"
                          : "1px solid #292929",
                        background: reportReason === reason
                          ? "#15130f"
                          : "#0b0b0b",
                        color: reportReason === reason
                          ? "#f4ead7"
                          : "#77736b",
                        fontSize: "10px",
                        letterSpacing: "0.7px",
                        cursor: "pointer",
                      }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setReportTarget(null);
                      setReportReason("");
                      setReportDescription("");
                    }}
                    style={{
                      flex: 1,
                      height: "42px",
                      border: "1px solid #292929",
                      background: "transparent",
                      color: "#77736b",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: "pointer",
                    }}
                  >
                    CANCELAR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReport(reportTarget)}
                    disabled={!reportReason}
                    style={{
                      flex: 1,
                      height: "42px",
                      border: "1px solid #c9b58a",
                      background: reportReason ? "#c9b58a" : "transparent",
                      color: reportReason ? "#050505" : "#555149",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: reportReason ? "pointer" : "not-allowed",
                      opacity: reportReason ? 1 : 0.65,
                    }}
                  >
                    ENVIAR DENÚNCIA
                  </button>
                </div>
              </div>
            </div>
          )}

          {boostOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "rgba(0,0,0,0.82)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "460px",
                  border: "1px solid #292929",
                  background: "#080808",
                  padding: "28px",
                  boxShadow: "0 20px 70px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "2px", marginBottom: "10px" }}>
                      MOON / DESTAQUE
                    </div>
                    <h2 style={{ color: "#f4ead7", fontSize: "24px", fontWeight: "400", letterSpacing: "1px", margin: 0, textAlign: "center" }}>
                      ⚡ BOOST
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBoostOpen(false)}
                    style={{ border: "none", background: "transparent", color: "#77736b", fontSize: "22px", cursor: "pointer", padding: 0 }}
                  >
                    ×
                  </button>
                </div>

                <p style={{ color: "#aaa59b", fontSize: "12px", lineHeight: "1.7", margin: "20px 0 24px", textAlign: "center" }}>
                  Coloque seu perfil em destaque na descoberta e aumente sua visibilidade para pessoas próximas.
                </p>

                <div style={{ display: "grid", gap: "8px" }}>
                  {[
                    { hours: 1, price: "R$ 5,00" },
                    { hours: 3, price: "R$ 8,00", popular: true },
                    { hours: 5, price: "R$ 10,00" },
                  ].map((plan) => (
                    <button
                      key={plan.hours}
                      type="button"
                      onClick={() => setSelectedBoostHours(plan.hours)}
                      style={{
                        width: "100%",
                        minHeight: "64px",
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        border: selectedBoostHours === plan.hours ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selectedBoostHours === plan.hours ? "#15130f" : "#0b0b0b",
                        color: "#f4ead7",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span>
                        <span style={{ display: "block", fontSize: "10px", letterSpacing: "1.6px" }}>
                          {plan.hours} {plan.hours === 1 ? "HORA" : "HORAS"}
                        </span>
                        {plan.popular && (
                          <span style={{ display: "block", marginTop: "5px", color: "#c9b58a", fontSize: "8px", letterSpacing: "1.4px" }}>
                            MAIS POPULAR
                          </span>
                        )}
                      </span>
                      <strong style={{ color: "#c9b58a", fontSize: "15px", fontWeight: "500" }}>
                        {plan.price}
                      </strong>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleCreateBoost}
                  disabled={!mercadoPagoPublicKey}
                  style={{
                    width: "100%",
                    height: "50px",
                    marginTop: "18px",
                    border: "1px solid #c9b58a",
                    background: "#c9b58a",
                    color: "#050505",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    cursor: "pointer",
                    opacity: mercadoPagoPublicKey ? 1 : 0.5,
                  }}
                >
                  ATIVAR BOOST · {selectedBoostHours === 1 ? "R$ 5,00" : selectedBoostHours === 3 ? "R$ 8,00" : "R$ 10,00"}
                </button>

                <p style={{ color: "#555149", fontSize: "9px", lineHeight: "1.6", textAlign: "center", margin: "13px 0 0" }}>
                  Pagamento seguro via Mercado Pago.
                </p>

                {message && (
                  <p style={{ color: "#c9b58a", fontSize: "10px", lineHeight: "1.5", textAlign: "center", margin: "15px 0 0" }}>
                    {message}
                  </p>
                )}
              </div>
            </div>
          )}

          {boostPaymentOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 1100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                background: "rgba(0,0,0,0.88)",
                backdropFilter: "blur(10px)",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "520px",
                  maxHeight: "92vh",
                  overflowY: "auto",
                  border: "1px solid #292929",
                  background: "#080808",
                  padding: "24px",
                  boxShadow: "0 20px 70px rgba(0,0,0,0.55)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "15px", marginBottom: "18px" }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "2px", marginBottom: "9px" }}>
                      MOON / PAGAMENTO
                    </div>
                    <h2 style={{ color: "#f4ead7", fontSize: "22px", fontWeight: "400", letterSpacing: "1px", margin: 0 }}>
                      ⚡ BOOST
                    </h2>
                    <div style={{ color: "#c9b58a", fontSize: "11px", letterSpacing: "1.5px", marginTop: "8px" }}>
                      {selectedBoostHours} {selectedBoostHours === 1 ? "HORA" : "HORAS"} · R$ {boostPaymentAmount.toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={boostPaymentLoading}
                    onClick={() => {
                      if (!boostPaymentLoading) {
                        setBoostPaymentOpen(false);
                        setBoostPaymentSubmitted(false);
                        setBoostPaymentStatus("");
                      }
                    }}
                    style={{ border: "none", background: "transparent", color: "#77736b", fontSize: "22px", cursor: boostPaymentLoading ? "not-allowed" : "pointer", padding: 0 }}
                  >
                    ×
                  </button>
                </div>

                {!mercadoPagoPublicKey ? (
                  <div style={{ border: "1px solid #3a3030", background: "#110b0b", padding: "18px", color: "#c99a9a", fontSize: "11px", lineHeight: "1.7", textAlign: "center" }}>
                    A chave pública do Mercado Pago não foi encontrada no ambiente do MOON.
                  </div>
                ) : (
                  <>
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", textAlign: "center", marginBottom: "15px" }}>
                      ESCOLHA PIX OU CARTÃO
                    </div>

                    {!boostPaymentSubmitted && (
                      <Payment
                        initialization={{
                          amount: boostPaymentAmount,
                          payer: {
                            email: boostPaymentEmail,
                          },
                        }}
                        customization={{
                          paymentMethods: {
                            creditCard: "all",
                            debitCard: "all",
                            prepaidCard: "all",
                            bankTransfer: "all",
                          },
                        }}
                        onSubmit={handleBoostPaymentSubmit}
                        onReady={() => {
                          setBoostPaymentStatus("");
                        }}
                        onError={(error) => {
                          console.error("ERRO NO PAYMENT BRICK:", error);
                          setBoostPaymentStatus("");
                          setMessage("Não foi possível carregar o pagamento. Tente novamente.");
                        }}
                      />
                    )}

                    {boostPaymentSubmitted && boostPaymentResult?.pix?.qr_code_base64 && (
                      <div style={{ marginTop: "18px", border: "1px solid #292929", background: "#0b0b0b", padding: "20px", textAlign: "center" }}>
                        <div style={{ color: "#f4ead7", fontSize: "12px", letterSpacing: "1.5px", marginBottom: "14px" }}>
                          PAGUE COM PIX
                        </div>
                        <img
                          src={`data:image/png;base64,${boostPaymentResult.pix.qr_code_base64}`}
                          alt="QR Code Pix"
                          style={{ width: "210px", height: "210px", objectFit: "contain", background: "#ffffff", padding: "8px" }}
                        />
                        {boostPaymentResult.pix.qr_code && (
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(boostPaymentResult.pix.qr_code);
                                setMessage("Pix Copia e Cola copiado.");
                              } catch {
                                setMessage("Não foi possível copiar o Pix.");
                              }
                            }}
                            style={{ width: "100%", height: "44px", marginTop: "14px", border: "1px solid #c9b58a", background: "transparent", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", cursor: "pointer" }}
                          >
                            COPIAR PIX COPIA E COLA
                          </button>
                        )}
                      </div>
                    )}

                    {boostPaymentStatus && (
                      <div style={{ marginTop: "16px", color: boostPaymentStatus.includes("ATIVO") ? "#c9b58a" : "#77736b", fontSize: "10px", lineHeight: "1.6", textAlign: "center", letterSpacing: "0.8px" }}>
                        {boostPaymentStatus}
                      </div>
                    )}

                    {boostPaymentSubmitted && (
                      <button
                        type="button"
                        disabled={boostPaymentLoading}
                        onClick={() => {
                          setBoostPaymentOpen(false);
                          setBoostPaymentSubmitted(false);
                          setBoostPaymentStatus("");
                          setBoostPaymentResult(null);
                          setMessage("");
                        }}
                        style={{ width: "100%", height: "44px", marginTop: "18px", border: "1px solid #292929", background: "transparent", color: "#77736b", fontSize: "9px", letterSpacing: "1.5px", cursor: boostPaymentLoading ? "not-allowed" : "pointer" }}
                      >
                        FECHAR
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* NAVEGAÇÃO INFERIOR */}

          <div
            style={{
              position: "sticky",
              bottom: "14px",
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "35px",
              padding: "8px",
              background: "rgba(5,5,5,0.94)",
              border: "1px solid #202020",
              backdropFilter: "blur(10px)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setProfileEditMode(false);
                setScreen("profile");
                setMessage("");
              }}
              style={{
                flex: 1,
                maxWidth: "180px",
                height: "42px",
                border: "1px solid #292929",
                background: "transparent",
                color: "#f4ead7",
                fontSize: "10px",
                letterSpacing: "1.8px",
                cursor: "pointer",
              }}
            >
              ♙ &nbsp; MEU PERFIL
            </button>

            <button
              type="button"
              onClick={handleOpenLikes}
              style={{
                flex: 1,
                maxWidth: "180px",
                height: "42px",
                border: "1px solid #c9b58a",
                background: "transparent",
                color: "#f4ead7",
                fontSize: "10px",
                letterSpacing: "1.8px",
                cursor: "pointer",
              }}
            >
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span>♥</span>
                <span>CURTIDAS</span>
                {notificationCount.like > 0 && (
                  <span
                    style={{
                      minWidth: "17px",
                      height: "17px",
                      padding: "0 5px",
                      borderRadius: "999px",
                      background: "#c9b58a",
                      color: "#111",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {notificationCount.like > 99 ? "99+" : notificationCount.like}
                  </span>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenConversations}
              style={{
                flex: 1,
                maxWidth: "180px",
                height: "42px",
                border: "1px solid #c9b58a",
                background: "transparent",
                color: "#f4ead7",
                fontSize: "10px",
                letterSpacing: "1.8px",
                cursor: "pointer",
              }}
            >
              <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <span>💬</span>
                <span>CONVERSAS</span>
                {notificationCount.message > 0 && (
                  <span
                    style={{
                      minWidth: "17px",
                      height: "17px",
                      padding: "0 5px",
                      borderRadius: "999px",
                      background: "#c9b58a",
                      color: "#111",
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {notificationCount.message > 99 ? "99+" : notificationCount.message}
                  </span>
                )}
              </span>
            </button>
          </div>

          {/* SAIR */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
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