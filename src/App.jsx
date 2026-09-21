import { useEffect, useRef, useState } from "react";
import { Circle, CircleMarker, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MoonSkeleton({ rows = 3, compact = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? "8px" : "12px", padding: compact ? "8px 0" : "20px 0" }}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px", padding: compact ? "0" : "6px 0" }}>
          <div style={{ width: compact ? "28px" : "46px", height: compact ? "28px" : "46px", borderRadius: "50%", background: "linear-gradient(90deg, #151515 25%, #222 50%, #151515 75%)", backgroundSize: "200% 100%", animation: "moonSkeleton 1.4s ease-in-out infinite", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: index % 2 === 0 ? "48%" : "38%", height: "8px", borderRadius: "2px", marginBottom: "7px", background: "linear-gradient(90deg, #151515 25%, #222 50%, #151515 75%)", backgroundSize: "200% 100%", animation: "moonSkeleton 1.4s ease-in-out infinite" }} />
            <div style={{ width: index % 2 === 0 ? "72%" : "58%", height: "6px", borderRadius: "2px", background: "linear-gradient(90deg, #151515 25%, #222 50%, #151515 75%)", backgroundSize: "200% 100%", animation: "moonSkeleton 1.4s ease-in-out infinite" }} />
          </div>
        </div>
      ))}
      <style>{`@keyframes moonSkeleton { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }`}</style>
    </div>
  );
}

function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapCenterController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (!center || center.length !== 2) return;
    map.flyTo(center, zoom, { duration: 0.7 });
  }, [center, zoom, map]);

  return null;
}

import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { supabase } from "./supabase";
import "./App.css";


function App() {
  const [screen, setScreen] = useState("home");
  const [mapRadius, setMapRadius] = useState(50);
  const [selectedMapPoint, setSelectedMapPoint] = useState(null);
  const [mapCenterRequest, setMapCenterRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [ageVerified, setAgeVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [pwaInstallAvailable, setPwaInstallAvailable] = useState(false);
  const [pwaIosInstallAvailable, setPwaIosInstallAvailable] = useState(false);
  const deferredInstallPromptRef = useRef(null);
  const [showIosInstallGuide, setShowIosInstallGuide] = useState(false);

  const [toast, setToast] = useState(null);
const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);
  const [notificationCount, setNotificationCount] = useState({
    like: 0,
    message: 0,
    match: 0,
    boost: 0,
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

  const verificationVideoRef = useRef(null);
  const verificationStreamRef = useRef(null);
  const [verificationCameraLoading, setVerificationCameraLoading] = useState(false);
  const [verificationFaceDetected, setVerificationFaceDetected] = useState(false);
  const [verificationLivenessPassed, setVerificationLivenessPassed] = useState(false);
  const verificationFaceDetectorRef = useRef(null);
  const verificationDetectionFrameRef = useRef(null);
  const verificationLastDetectionTimeRef = useRef(0);
  const verificationBlinkStateRef = useRef("open");
  const verificationBlinkDetectedRef = useRef(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [profileDisplayName, setProfileDisplayName] = useState("");
  const [profileBirthDate, setProfileBirthDate] = useState("");
  const [profileNameChangedAt, setProfileNameChangedAt] = useState(null);
  const [profileOriginalName, setProfileOriginalName] = useState("");
  const [profileEditMode, setProfileEditMode] = useState(false);

  const [profileForm, setProfileForm] = useState({
    city: "",
    bio: "",
    gender: "",
    sexuality: "",
    position: "",
    availability: "",
    profession: "",
    education: "",
    intention: [],
    habits: [],
    hobbies: [],
    personality: [],
    relationship: [],
    interests: [],
    languages: [],
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
  const [mapProfiles, setMapProfiles] = useState([]);
  const [mapProfilesLoading, setMapProfilesLoading] = useState(false);
  const [selectedMapProfile, setSelectedMapProfile] = useState(null);
  const [selectedMapProfileLoading, setSelectedMapProfileLoading] = useState(false);
  const [showMapProfilesPanel, setShowMapProfilesPanel] = useState(false);
  const [showMapFilters, setShowMapFilters] = useState(false);
  const [activeAdvertisements, setActiveAdvertisements] = useState([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [showAgeFilter, setShowAgeFilter] = useState(false);
  const [showIdentityFilter, setShowIdentityFilter] = useState(false);
  const [showSexualityFilter, setShowSexualityFilter] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(65);
  const [identityFilter, setIdentityFilter] = useState([]);
  const [sexualityFilter, setSexualityFilter] = useState([]);
  const [positionFilter, setPositionFilter] = useState([]);
  const [showPositionFilter, setShowPositionFilter] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [showAvailabilityFilter, setShowAvailabilityFilter] = useState(false);
  const [filterDraftMinAge, setFilterDraftMinAge] = useState(18);
  const [filterDraftMaxAge, setFilterDraftMaxAge] = useState(65);
  const [filterDraftIdentity, setFilterDraftIdentity] = useState([]);
  const [filterDraftSexuality, setFilterDraftSexuality] = useState([]);
  const [filterDraftPosition, setFilterDraftPosition] = useState([]);
  const [filterDraftAvailability, setFilterDraftAvailability] = useState([]);
  const [intentionFilter, setIntentionFilter] = useState([]);
  const [filterDraftIntention, setFilterDraftIntention] = useState([]);
  const [filterDraftHabits, setFilterDraftHabits] = useState([]);
  const [filterDraftHobbies, setFilterDraftHobbies] = useState([]);
  const [filterDraftPersonality, setFilterDraftPersonality] = useState([]);
  const [filterDraftRelationship, setFilterDraftRelationship] = useState([]);
  const [filterDraftInterests, setFilterDraftInterests] = useState([]);
  const [filterDraftLanguages, setFilterDraftLanguages] = useState([]);

  const [chatTarget, setChatTarget] = useState(null);
  const [chatConversation, setChatConversation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState("");
  const [chatReplyToMessage, setChatReplyToMessage] = useState(null);
  const [chatTyping, setChatTyping] = useState(false);
  const chatTypingTimeoutRef = useRef(null);
  const chatChannelReadyRef = useRef(false);
  const chatRealtimeChannelRef = useRef(null);
  const chatMessagesContainerRef = useRef(null);
const chatMessagesBottomRef = useRef(null);
  const chatMediaInputRef = useRef(null);
  const chatGalleryInputRef = useRef(null);
  const chatVideoInputRef = useRef(null);
  const [chatMediaLoading, setChatMediaLoading] = useState(false);
  const [chatMediaMode, setChatMediaMode] = useState(null);
  const [chatMediaIntimate, setChatMediaIntimate] = useState(false);
  const [dismissedIntimateMessageIds, setDismissedIntimateMessageIds] = useState([]);
  const [showChatAttachMenu, setShowChatAttachMenu] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatBlocked, setChatBlocked] = useState(false);
  const [chatIcebreaker, setChatIcebreaker] = useState(null);
  const [chatConnection, setChatConnection] = useState(null);
  const [chatFollowUpSuggestion, setChatFollowUpSuggestion] = useState(null);
  const [chatDeepSuggestion, setChatDeepSuggestion] = useState(null);
  const [offensiveWarning, setOffensiveWarning] = useState(false);
  const [offensivePendingContent, setOffensivePendingContent] = useState("");
  const [threatWarning, setThreatWarning] = useState(false);
  const [threatPendingContent, setThreatPendingContent] = useState("");
  const [dismissedThreatMessageIds, setDismissedThreatMessageIds] = useState([]);
  const [dismissedOffensiveMessageIds, setDismissedOffensiveMessageIds] = useState([]);
  const [chatRefusalMarkedAt, setChatRefusalMarkedAt] = useState(null);
  const [chatRefusalPending, setChatRefusalPending] = useState(false);
  const [dismissedInsistenceWarningMessageIds, setDismissedInsistenceWarningMessageIds] = useState([]);
  const [chatPhotoConfirmationEnabled, setChatPhotoConfirmationEnabled] = useState(false);
  const [intimateContentPreference, setIntimateContentPreference] = useState("confirm");
  const [chatRevealedPhotoIds, setChatRevealedPhotoIds] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [statusClock, setStatusClock] = useState(Date.now());
  const [captureShieldActive, setCaptureShieldActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [abusiveRestrictionUntil, setAbusiveRestrictionUntil] = useState(null);
  const [abusiveRestrictionLoading, setAbusiveRestrictionLoading] = useState(false);
  useEffect(() => {
    if (!currentUserId) return;

    try {
      const savedPreference = window.localStorage.getItem(`moon-chat-photo-confirmation-${currentUserId}`);
      setChatPhotoConfirmationEnabled(savedPreference === "true");
    } catch (error) {
      console.error("ERRO AO CARREGAR PROTEÇÃO DE FOTOS:", error);
    }
  }, [currentUserId]);

  const [adminLoading, setAdminLoading] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [adminReports, setAdminReports] = useState([]);
  const [adminReportsLoading, setAdminReportsLoading] = useState(false);
  const [adminSupportTickets, setAdminSupportTickets] = useState([]);
  const [adminSupportLoading, setAdminSupportLoading] = useState(false);
  const [adminSupportSelected, setAdminSupportSelected] = useState(null);
  const [adminSupportResponse, setAdminSupportResponse] = useState("");
  const [adminSupportActionLoading, setAdminSupportActionLoading] = useState(false);
  const [userSupportTickets, setUserSupportTickets] = useState([]);
  const [userSupportLoading, setUserSupportLoading] = useState(false);
  const [adminActionReportId, setAdminActionReportId] = useState(null);
  const [adminAction, setAdminAction] = useState("");
  const [adminActionNote, setAdminActionNote] = useState("");
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminBoosts, setAdminBoosts] = useState([]);
  const [adminBoostProfiles, setAdminBoostProfiles] = useState([]);
  const [adminBoostSearch, setAdminBoostSearch] = useState("");
  const [adminBoostSelectedProfile, setAdminBoostSelectedProfile] = useState(null);
  const [adminBoostDuration, setAdminBoostDuration] = useState("1");
  const [adminBoostLoading, setAdminBoostLoading] = useState(false);
  const [adminBoostSaving, setAdminBoostSaving] = useState(false);
  const [userBoosts, setUserBoosts] = useState([]);
  const [userBoostsLoading, setUserBoostsLoading] = useState(false);
  const [boostActivatingId, setBoostActivatingId] = useState(null);
  const [userActiveBoost, setUserActiveBoost] = useState(null);
  const [boostSecondsLeft, setBoostSecondsLeft] = useState(0);

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
  const [conversationFilter, setConversationFilter] = useState("all");
  const [pinnedConversationIds, setPinnedConversationIds] = useState([]);
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesTab, setLikesTab] = useState("interesses");
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [chatOrigin, setChatOrigin] = useState("inside");
  const [reportTarget, setReportTarget] = useState(null);
  const [showChatMenu, setShowChatMenu] = useState(false);

  const [showSelectedProfileMenu, setShowSelectedProfileMenu] = useState(false);
  const [legalPage, setLegalPage] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);
  const [isProfileHidden, setIsProfileHidden] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockedUsersLoading, setBlockedUsersLoading] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const [supportForm, setSupportForm] = useState({
    category: "question",
    subject: "",
    description: "",
  });
  const [supportSubmitting, setSupportSubmitting] = useState(false);
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
  const [selectedProfileFromMap, setSelectedProfileFromMap] = useState(false);
  const [selectedProfilePhotos, setSelectedProfilePhotos] = useState([]);
  const [selectedProfileLoading, setSelectedProfileLoading] = useState(false);
  const [matchTarget, setMatchTarget] = useState(null);

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

  function showToast({ title = "", body = "" }) {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setToast({
      id: Date.now(),
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
    const isStandalone =
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true;

    const isIos = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !window.MSStream;

    if (!isStandalone && isIos) {
      setPwaIosInstallAvailable(true);
    }

    const ensureLink = (rel, href, extra = {}) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
      Object.entries(extra).forEach(([key, value]) => {
        link.setAttribute(key, value);
      });
    };

    ensureLink("manifest", "/manifest.json");
    ensureLink("apple-touch-icon", "/apple-touch-icon.png");

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement("meta");
      themeMeta.name = "theme-color";
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = "#000000";

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      deferredInstallPromptRef.current = event;
      if (!isStandalone) {
        setPwaInstallAvailable(true);
      }
    };

    const handleAppInstalled = () => {
      deferredInstallPromptRef.current = null;
      setPwaInstallAvailable(false);
      setPwaIosInstallAvailable(false);
      setMessage("MOON adicionada ao seu dispositivo.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("NÃO FOI POSSÍVEL ATIVAR O APP MOON:", error);
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function handleInstallMoon() {
    const deferredPrompt = deferredInstallPromptRef.current;

    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
          setPwaInstallAvailable(false);
          setMessage("MOON adicionada ao seu dispositivo.");
        } else {
          setMessage("A instalação foi cancelada. Você pode tentar novamente quando quiser.");
        }
      } catch (error) {
        console.warn("NÃO FOI POSSÍVEL ABRIR A INSTALAÇÃO DA MOON:", error);
        setMessage("Não foi possível abrir a instalação agora. Tente novamente.");
      } finally {
        deferredInstallPromptRef.current = null;
      }

      return;
    }

    if (pwaIosInstallAvailable) {
      setMessage("");
      setShowIosInstallGuide(true);
      return;
    }

    setMessage(
      "Use o menu do navegador e escolha 'Instalar MOON' ou 'Adicionar à tela inicial'."
    );
  }

  useEffect(() => {
    if (screen !== "verificationCamera") {
      if (verificationStreamRef.current) {
        verificationStreamRef.current.getTracks().forEach((track) => track.stop());
        verificationStreamRef.current = null;
      }

      if (verificationVideoRef.current) {
        verificationVideoRef.current.srcObject = null;
      }

      return;
    }

    let cancelled = false;

    async function startVerificationCamera() {
      setVerificationCameraLoading(true);
      setMessage("");

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Seu navegador não permite acesso à câmera.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        verificationStreamRef.current = stream;

        if (verificationVideoRef.current) {
          verificationVideoRef.current.srcObject = stream;
          await verificationVideoRef.current.play().catch(() => {});
        }
      } catch (error) {
        console.error("ERRO AO ABRIR CÂMERA DE VERIFICAÇÃO:", error);

        if (!cancelled) {
          setMessage(
            error?.name === "NotAllowedError"
              ? "Permita o acesso à câmera para continuar a verificação."
              : error?.message || "Não foi possível acessar a câmera."
          );
        }
      } finally {
        if (!cancelled) {
          setVerificationCameraLoading(false);
        }
      }
    }

    startVerificationCamera();

    return () => {
      cancelled = true;

      if (verificationStreamRef.current) {
        verificationStreamRef.current.getTracks().forEach((track) => track.stop());
        verificationStreamRef.current = null;
      }

      if (verificationVideoRef.current) {
        verificationVideoRef.current.srcObject = null;
      }
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "verificationCamera") {
      setVerificationFaceDetected(false);
      setVerificationLivenessPassed(false);
      verificationFaceDetectorRef.current = null;
      verificationLastDetectionTimeRef.current = 0;
      verificationBlinkStateRef.current = "open";
      verificationBlinkDetectedRef.current = false;

      if (verificationDetectionFrameRef.current) {
        cancelAnimationFrame(verificationDetectionFrameRef.current);
        verificationDetectionFrameRef.current = null;
      }

      return;
    }

    let cancelled = false;

    async function startFaceDetection() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          minFaceDetectionConfidence: 0.6,
          minFacePresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,
          outputFaceBlendshapes: false,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        verificationFaceDetectorRef.current = landmarker;

        const distance = (a, b) =>
          Math.hypot(a.x - b.x, a.y - b.y);

        const eyeAspectRatio = (landmarks, indices) => {
          const p1 = landmarks[indices[0]];
          const p2 = landmarks[indices[1]];
          const p3 = landmarks[indices[2]];
          const p4 = landmarks[indices[3]];
          const p5 = landmarks[indices[4]];
          const p6 = landmarks[indices[5]];

          return (
            (distance(p2, p6) + distance(p3, p5)) /
            (2 * distance(p1, p4))
          );
        };

        const detectFace = () => {
          if (cancelled) return;

          const video = verificationVideoRef.current;
          const faceLandmarker = verificationFaceDetectorRef.current;

          if (video && faceLandmarker && video.readyState >= 2 && video.videoWidth > 0) {
            const now = performance.now();

            if (now - verificationLastDetectionTimeRef.current >= 120) {
              verificationLastDetectionTimeRef.current = now;

              try {
                const result = faceLandmarker.detectForVideo(video, now);
                const landmarks = result?.faceLandmarks?.[0];
                const hasFace = Boolean(landmarks?.length);

                setVerificationFaceDetected(hasFace);

                if (hasFace && !verificationBlinkDetectedRef.current) {
                  const leftEar = eyeAspectRatio(landmarks, [33, 160, 158, 133, 153, 144]);
                  const rightEar = eyeAspectRatio(landmarks, [362, 385, 387, 263, 373, 380]);
                  const averageEar = (leftEar + rightEar) / 2;

                  if (averageEar < 0.20) {
                    verificationBlinkStateRef.current = "closed";
                  } else if (
                    averageEar > 0.24 &&
                    verificationBlinkStateRef.current === "closed"
                  ) {
                    verificationBlinkStateRef.current = "open";
                    verificationBlinkDetectedRef.current = true;
                    setVerificationLivenessPassed(true);
                    setMessage("Verificação concluída. Você pode continuar.");
                  }
                }
              } catch (error) {
                console.error("ERRO NA VERIFICAÇÃO FACIAL:", error);
              }
            }
          }

          verificationDetectionFrameRef.current = requestAnimationFrame(detectFace);
        };

        verificationDetectionFrameRef.current = requestAnimationFrame(detectFace);
      } catch (error) {
        console.error("ERRO AO INICIAR VERIFICAÇÃO FACIAL:", error);
        setVerificationFaceDetected(false);
        setVerificationLivenessPassed(false);
        setMessage("Não foi possível iniciar a verificação facial neste navegador.");
      }
    }

    startFaceDetection();

    return () => {
      cancelled = true;

      if (verificationDetectionFrameRef.current) {
        cancelAnimationFrame(verificationDetectionFrameRef.current);
        verificationDetectionFrameRef.current = null;
      }

      if (verificationFaceDetectorRef.current) {
        verificationFaceDetectorRef.current.close();
        verificationFaceDetectorRef.current = null;
      }
    };
  }, [screen]);

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
      setNotificationCount({ like: 0, message: 0, match: 0, boost: 0 });
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
            if (!item.is_read && (item.type === "like" || item.type === "message" || item.type === "boost")) {
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

          if (notification.type === "like" || notification.type === "message" || notification.type === "match" || notification.type === "boost") {
            setNotificationCount((current) => ({
              ...current,
              [notification.type]: current[notification.type] + (notification.is_read ? 0 : 1),
            }));
          }

          if (notification.type === "like") {
            playNotificationSound();
          showToast({
              title: notification.title || "Nova curtida",
              body: notification.body || "Alguém curtiu você.",
            });
          } else if (notification.type === "message") {
          playNotificationSound();
            showToast({
              title: notification.title || "Nova mensagem",
              body: notification.body || "Você recebeu uma nova mensagem.",
            });
          } else if (notification.type === "match") {
            playNotificationSound();
            showToast({
              title: "Vocês se conectaram",
              body: "Você tem um novo Match na MOON.",
            });
          } else if (notification.type === "boost") {
            playNotificationSound();
            showToast({
              title: "Você ganhou um Boost 🚀",
              body: "Um Boost foi concedido ao seu perfil. Ative quando quiser.",
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

  async function checkAdminStatus() {
    try {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) { console.error("ERRO AO VERIFICAR ADMIN:", error); setIsAdmin(false); return false; }
      const admin = data === true;
      setIsAdmin(admin);
      return admin;
    } catch (error) { console.error("ERRO AO VERIFICAR ADMIN:", error); setIsAdmin(false); return false; }
  }

  async function loadAdminBoosts() {
    const admin = await checkAdminStatus();
    if (!admin) { setMessage("Acesso restrito."); return; }
    setAdminBoostLoading(true);
    try {
      const { data, error } = await supabase
        .from("profile_boosts")
        .select("id, user_id, starts_at, expires_at, active, status, duration_hours, activated_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const boosts = data || [];
      const ids = [...new Set(boosts.map((item) => item.user_id).filter(Boolean))];
      let profiles = [];
      if (ids.length) {
        const { data: rows, error: profileError } = await supabase
          .from("profiles")
          .select("id, name")
          .in("id", ids);
        if (profileError) throw profileError;
        profiles = rows || [];
      }
      const byId = new Map(profiles.map((profile) => [profile.id, profile]));
      setAdminBoosts(boosts.map((boost) => ({ ...boost, profile: byId.get(boost.user_id) || null })));
    } catch (error) {
      console.error("ERRO AO CARREGAR BOOSTS:", error);
      setMessage(error.message || "Não foi possível carregar os boosts.");
    } finally {
      setAdminBoostLoading(false);
    }
  }

  async function searchAdminBoostProfiles(value) {
    setAdminBoostSearch(value);
    setAdminBoostSelectedProfile(null);

    const searchValue = value.trim();
    if (!searchValue) {
      setAdminBoostProfiles([]);
      return;
    }

    try {
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(searchValue);

      if (isUuid) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, name")
          .eq("id", searchValue)
          .limit(1);

        if (error) throw error;

        setAdminBoostProfiles(data || []);
        return;
      }

      if (searchValue.includes("@")) {
        const { data, error } = await supabase.rpc(
          "admin_find_user_by_email",
          {
            p_email: searchValue,
          }
        );

        if (error) throw error;

        setAdminBoostProfiles(data || []);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name")
        .ilike("name", `%${searchValue}%`)
        .limit(12);

      if (error) throw error;

      setAdminBoostProfiles(data || []);
    } catch (error) {
      console.error("ERRO AO BUSCAR PERFIS PARA BOOST:", error);
      setAdminBoostProfiles([]);
      setMessage(error.message || "Não foi possível buscar o usuário.");
    }
  }

  async function createAdminBoost() {
    const admin = await checkAdminStatus();
    if (!admin) {
      setMessage("Acesso restrito.");
      return;
    }

    if (!adminBoostSelectedProfile?.id) {
      setMessage("Selecione um usuário para conceder o Boost.");
      return;
    }

    const hours = Number(adminBoostDuration);
    if (![1, 3, 5].includes(hours)) {
      setMessage("Selecione uma duração válida: 1h, 3h ou 5h.");
      return;
    }

    setAdminBoostSaving(true);
    setMessage("");

    try {
      const { data: boostId, error } = await supabase.rpc(
        "admin_grant_profile_boost",
        {
          target_user_id: adminBoostSelectedProfile.id,
          boost_duration_hours: hours,
        }
      );

      if (error) throw error;

      if (!boostId) {
        throw new Error("O Boost não foi criado.");
      }

      setMessage("Boost concedido. O usuário recebeu o Boost disponível para ativação.");
      setAdminBoostSelectedProfile(null);
      setAdminBoostSearch("");
      setAdminBoostProfiles([]);
      setAdminBoostDuration("1");
      await loadAdminBoosts();
    } catch (error) {
      console.error("ERRO AO CONCEDER BOOST:", error);
      setMessage(error?.message || "Não foi possível conceder o Boost.");
    } finally {
      setAdminBoostSaving(false);
    }
  }

  async function deactivateAdminBoost(boostId) {
    const admin = await checkAdminStatus();
    if (!admin) { setMessage("Acesso restrito."); return; }
    try {
      const { data: boost, error: boostError } = await supabase
        .from("profile_boosts")
        .select("id, status")
        .eq("id", boostId)
        .single();
      if (boostError) throw boostError;

      const nextUpdate = boost.status === "available"
        ? { active: false, status: "cancelled" }
        : { active: false, status: "used", expires_at: new Date().toISOString() };

      const { error } = await supabase
        .from("profile_boosts")
        .update(nextUpdate)
        .eq("id", boostId);
      if (error) throw error;
      setMessage(boost.status === "available" ? "Boost cancelado." : "Boost encerrado.");
      await loadAdminBoosts();
    } catch (error) {
      console.error("ERRO AO ENCERRAR BOOST:", error);
      setMessage(error.message || "Não foi possível encerrar o boost.");
    }
  }

  function formatBoostCountdown(totalSeconds) {
    const safe = Math.max(0, Number(totalSeconds) || 0);
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  async function loadUserBoosts() {
    if (!currentUserId) return;

    setUserBoostsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profile_boosts")
        .select("id, user_id, status, duration_hours, starts_at, expires_at, activated_at, active, created_at")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const boosts = data || [];
      const now = Date.now();
      const activeBoost = boosts.find(
        (boost) =>
          boost.status === "active" &&
          boost.active === true &&
          boost.expires_at &&
          new Date(boost.expires_at).getTime() > now
      ) || null;

      setUserBoosts(boosts);
      setUserActiveBoost(activeBoost);
      setBoostSecondsLeft(
        activeBoost
          ? Math.max(0, Math.floor((new Date(activeBoost.expires_at).getTime() - now) / 1000))
          : 0
      );
    } catch (error) {
      console.error("ERRO AO CARREGAR MEUS BOOSTS:", error);
      setMessage(error.message || "Não foi possível carregar seus Boosts.");
    } finally {
      setUserBoostsLoading(false);
    }
  }

  async function activateUserBoost(boostId) {
    if (!currentUserId || !boostId || boostActivatingId) return;

    setBoostActivatingId(boostId);
    setMessage("");

    try {
      const { data: existingActive, error: activeError } = await supabase
        .from("profile_boosts")
        .select("id, expires_at")
        .eq("user_id", currentUserId)
        .eq("status", "active")
        .eq("active", true)
        .gt("expires_at", new Date().toISOString())
        .limit(1)
        .maybeSingle();

      if (activeError) throw activeError;

      if (existingActive) {
        setMessage("Você já possui um Boost ativo.");
        return;
      }

      const { data: boost, error: boostError } = await supabase
        .from("profile_boosts")
        .select("id, duration_hours, status")
        .eq("id", boostId)
        .eq("user_id", currentUserId)
        .eq("status", "available")
        .maybeSingle();

      if (boostError) throw boostError;
      if (!boost) {
        setMessage("Este Boost não está mais disponível.");
        await loadUserBoosts();
        return;
      }

      const { error: activationError } = await supabase.rpc(
        "activate_profile_boost",
        {
          p_boost_id: boostId,
        }
      );

      if (activationError) throw activationError;

      setMessage("Boost ativado. Seu perfil já está sendo impulsionado. 🚀");
      await loadUserBoosts();
    } catch (error) {
      console.error("ERRO AO ATIVAR BOOST:", error);
      setMessage(error.message || "Não foi possível ativar o Boost.");
    } finally {
      setBoostActivatingId(null);
    }
  }

  useEffect(() => {
    if (screen !== "myBoosts" || !currentUserId) return;
    loadUserBoosts();
  }, [screen, currentUserId]);

  useEffect(() => {
    if (!userActiveBoost || !userActiveBoost.expires_at) return;

    const timer = window.setInterval(async () => {
      const remaining = Math.max(0, Math.floor((new Date(userActiveBoost.expires_at).getTime() - Date.now()) / 1000));
      setBoostSecondsLeft(remaining);

      if (remaining <= 0) {
        window.clearInterval(timer);
        try {
          await supabase
            .from("profile_boosts")
            .update({ active: false, status: "used" })
            .eq("id", userActiveBoost.id)
            .eq("user_id", currentUserId)
            .eq("status", "active");
        } catch (error) {
          console.error("ERRO AO ENCERRAR BOOST EXPIRADO:", error);
        }
        await loadUserBoosts();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [userActiveBoost, currentUserId]);

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
      const [users, active, likes, conversations, messages, reports, blocks, support] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("likes").select("id", { count: "exact", head: true }),
        supabase.from("conversations").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
        supabase.from("reports").select("id", { count: "exact", head: true }),
        supabase.from("blocked_users").select("id", { count: "exact", head: true }),
        supabase.from("support_tickets").select("id", { count: "exact", head: true }).neq("status", "resolved"),
      ]);
      const err = [users, active, likes, conversations, messages, reports, blocks, support].find(r => r.error)?.error;
      if (err) throw err;
      setAdminStats({ totalUsers: users.count || 0, activeUsers: active.count || 0, likes: likes.count || 0, conversations: conversations.count || 0, messages: messages.count || 0, reports: reports.count || 0, blocks: blocks.count || 0, support: support.count || 0 });
    } catch (error) { console.error("ERRO AO CARREGAR PAINEL ADMIN:", error); setMessage(error.message || "Não foi possível carregar o painel administrativo."); }
    finally { setAdminLoading(false); }
  }

  async function openAdminPanel() {
    const admin = await checkAdminStatus();
    if (!admin) { setMessage("Acesso restrito."); return; }
    setScreen("admin");
    await loadAdminStats();
  }

  async function handleSubmitSupportTicket(event) {
    event?.preventDefault();

    const subject = supportForm.subject.trim();
    const description = supportForm.description.trim();

    if (!subject) {
      setMessage("Informe o assunto do chamado.");
      return;
    }

    if (!description) {
      setMessage("Descreva sua dúvida ou problema.");
      return;
    }

    if (subject.length > 120) {
      setMessage("O assunto pode ter no máximo 120 caracteres.");
      return;
    }

    if (description.length > 3000) {
      setMessage("A descrição pode ter no máximo 3000 caracteres.");
      return;
    }

    setSupportSubmitting(true);
    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Sua sessão expirou. Entre novamente para abrir um chamado.");
        return;
      }

      const { error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          category: supportForm.category,
          subject,
          description,
        });

      if (error) throw error;

      setSupportForm({
        category: "question",
        subject: "",
        description: "",
      });

      setMessage("Chamado enviado com sucesso. Nossa equipe irá analisar sua solicitação.");
    } catch (error) {
      console.error("ERRO AO ENVIAR CHAMADO DE SUPORTE:", error);
      setMessage(error.message || "Não foi possível enviar seu chamado.");
    } finally {
      setSupportSubmitting(false);
    }
  }

  async function loadUserSupportTickets() {
    setUserSupportLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setUserSupportTickets([]);
        return;
      }

      const { data, error } = await supabase
        .from("support_tickets")
        .select("id, category, subject, description, status, admin_response, created_at, updated_at, resolved_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserSupportTickets(data || []);
    } catch (error) {
      console.error("ERRO AO CARREGAR MEUS CHAMADOS:", error);
      setMessage(error.message || "Não foi possível carregar seus chamados.");
    } finally {
      setUserSupportLoading(false);
    }
  }

  async function loadAdminSupportTickets() {
    const admin = await checkAdminStatus();
    if (!admin) {
      setMessage("Acesso restrito.");
      return;
    }

    setAdminSupportLoading(true);
    setMessage("");

    try {
      const { data: ticketRows, error: ticketError } = await supabase
        .from("support_tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (ticketError) throw ticketError;

      const tickets = ticketRows || [];
      const userIds = [...new Set(tickets.map((ticket) => ticket.user_id).filter(Boolean))];

      let profiles = [];
      if (userIds.length) {
        const { data: profileRows, error: profilesError } = await supabase
          .from("profiles")
          .select("id, name, birth_date")
          .in("id", userIds);

        if (profilesError) throw profilesError;
        profiles = profileRows || [];
      }

      const profileMap = new Map(profiles.map((profile) => [profile.id, profile]));

      setAdminSupportTickets(
        tickets.map((ticket) => ({
          ...ticket,
          user: profileMap.get(ticket.user_id) || null,
        }))
      );
    } catch (error) {
      console.error("ERRO AO CARREGAR SUPORTE ADMINISTRATIVO:", error);
      setMessage(error.message || "Não foi possível carregar os chamados de suporte.");
    } finally {
      setAdminSupportLoading(false);
    }
  }

  async function handleAdminSupportUpdate(ticketId, status) {
    if (!ticketId) return;

    const response = adminSupportResponse.trim();

    if (status === "answered" && !response) {
      setMessage("Escreva uma resposta antes de marcar o chamado como respondido.");
      return;
    }

    setAdminSupportActionLoading(true);
    setMessage("");

    try {
      const payload = {
        status,
        admin_response: response || null,
        resolved_at: status === "resolved" ? new Date().toISOString() : null,
      };

      const { error } = await supabase
        .from("support_tickets")
        .update(payload)
        .eq("id", ticketId);

      if (error) throw error;

      setAdminSupportSelected(null);
      setAdminSupportResponse("");
      setMessage(
        status === "resolved"
          ? "Chamado marcado como resolvido."
          : status === "answered"
            ? "Resposta enviada ao usuário."
            : "Chamado atualizado."
      );

      await loadAdminSupportTickets();
      await loadAdminStats();
    } catch (error) {
      console.error("ERRO AO ATUALIZAR CHAMADO DE SUPORTE:", error);
      setMessage(error.message || "Não foi possível atualizar o chamado.");
    } finally {
      setAdminSupportActionLoading(false);
    }
  }

  async function openAdminSupport() {
    const admin = await checkAdminStatus();
    if (!admin) {
      setMessage("Acesso restrito.");
      return;
    }

    setAdminSupportSelected(null);
    setAdminSupportResponse("");
    setScreen("adminSupport");
    await loadAdminSupportTickets();
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

    if (data.is_verified !== true && !import.meta.env.DEV) {
      setProfileDisplayName(data.name || "");
      setProfileBirthDate(data.birth_date || "");
      setScreen("verification");
      return;
    }

    setProfileDisplayName(data.name || "");
    setProfileOriginalName(data.name || "");
    setProfileBirthDate(data.birth_date || "");
    setProfileNameChangedAt(data.name_changed_at || null);
    setReadReceiptsEnabled(data.read_receipts_enabled !== false);
    setIsProfileHidden(data.is_hidden === true);
    setIntimateContentPreference(data.intimate_content_preference || "confirm");

    setProfileForm({
      city: "",
      bio: data.bio || "",
      gender: data.gender || "",
      sexuality: data.sexuality || "",
      position: data.position || "",
      availability: data.availability || "",
      profession: data.profession || "",
      education: data.education || "",
      intention: Array.isArray(data.intention) ? data.intention : [],
      habits: Array.isArray(data.habits) ? data.habits : [],
      hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
      personality: Array.isArray(data.personality) ? data.personality : [],
      relationship: Array.isArray(data.relationship) ? data.relationship : [],
      interests: Array.isArray(data.interests) ? data.interests : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
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

  async function openChatProfile(profile) {
    if (!profile?.id) {
      setMessage("Não foi possível abrir o perfil desta conversa.");
      return;
    }

    if (await isUserBlocked(profile.id)) {
      setMessage("ESTA CONTA ESTÁ INDISPONÍVEL");
      setSelectedProfile(null);
      setSelectedProfilePhotos([]);
      setShowSelectedProfileMenu(false);
      return;
    }

    setSelectedProfile(profile);
    setShowSelectedProfileMenu(false);
    setSelectedProfileLoading(true);
    setSelectedProfilePhotos([]);

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (profileData) {
        setSelectedProfile((current) => ({
          ...current,
          ...profileData,
        }));
      }

      const { data: photoData, error: photoError } = await supabase
        .from("profile_photos")
        .select("id, storage_path, is_primary, created_at")
        .eq("user_id", profile.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (photoError) throw photoError;

      const photosWithUrl = (photoData || []).map((photo) => {
        const { data: publicData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(photo.storage_path);

        return {
          ...photo,
          publicUrl: publicData?.publicUrl || null,
        };
      });

      setSelectedProfilePhotos(photosWithUrl);

      const { data: { user: viewer } } = await supabase.auth.getUser();

      if (viewer?.id && viewer.id !== profile.id) {
        await supabase.from("profile_views").insert({
          viewer_id: viewer.id,
          profile_id: profile.id,
        });
      }
    } catch (error) {
      console.error("ERRO AO ABRIR PERFIL DO CHAT:", error);
      setMessage(error.message || "Não foi possível carregar o perfil.");
    } finally {
      setSelectedProfileLoading(false);
    }
  }

  function getChatSuggestionStorageKey(conversationId) {
    if (!conversationId) return null;
    return `moon_chat_suggestion_stages_${conversationId}`;
  }

  function getConsumedChatSuggestionStages(conversationId) {
    const key = getChatSuggestionStorageKey(conversationId);
    if (!key) return [];

    try {
      const stored = window.localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("ERRO AO LER ESTÁGIOS DA CONVERSA:", error);
      return [];
    }
  }

  function markChatSuggestionStageAsShown(conversationId, stage) {
    const key = getChatSuggestionStorageKey(conversationId);
    if (!key || !stage) return;

    const currentStages = getConsumedChatSuggestionStages(conversationId);

    if (currentStages.includes(stage)) return;

    try {
      window.localStorage.setItem(
        key,
        JSON.stringify([...currentStages, stage])
      );
    } catch (error) {
      console.error("ERRO AO SALVAR ESTÁGIO DA CONVERSA:", error);
    }
  }

  useEffect(() => {
    if (
      !chatConnection ||
      !chatConversation?.id ||
      chatMessages.length !== 4 ||
      chatFollowUpSuggestion
    ) {
      return;
    }

    const consumedStages = getConsumedChatSuggestionStages(
      chatConversation.id
    );

    if (consumedStages.includes(4)) {
      return;
    }

    setChatFollowUpSuggestion({
      connection: chatConnection,
      question: getFollowUpForConnection(chatConnection),
    });
    markChatSuggestionStageAsShown(chatConversation.id, 4);
  }, [
    chatMessages.length,
    chatConnection,
    chatConversation?.id,
    chatFollowUpSuggestion,
  ]);

  useEffect(() => {
    if (
      !chatConnection ||
      !chatConversation?.id ||
      chatMessages.length !== 8 ||
      chatDeepSuggestion
    ) {
      return;
    }

    const consumedStages = getConsumedChatSuggestionStages(
      chatConversation.id
    );

    if (consumedStages.includes(8)) {
      return;
    }

    setChatDeepSuggestion({
      connection: chatConnection,
      question: getDeepFollowUpForConnection(chatConnection),
    });
    markChatSuggestionStageAsShown(chatConversation.id, 8);
  }, [
    chatMessages.length,
    chatConnection,
    chatConversation?.id,
    chatDeepSuggestion,
  ]);

  function getCommonConnections(profile) {
    if (!profile) return [];

    const connectionFields = [
      "intention",
      "habits",
      "hobbies",
      "personality",
      "relationship",
      "interests",
      "languages",
    ];

    const common = [];

    connectionFields.forEach((field) => {
      const currentValues = Array.isArray(profileForm[field])
        ? profileForm[field].filter(Boolean)
        : [];
      const profileValues = Array.isArray(profile[field])
        ? profile[field].filter(Boolean)
        : [];

      profileValues.forEach((value) => {
        if (currentValues.includes(value) && !common.includes(value)) {
          common.push(value);
        }
      });
    });

    return common;
  }

  function getFollowUpForConnection(connection) {
    const questions = {
      "Música": ["E qual música você colocaria para tocar agora?", "Qual música combina com o seu momento hoje?", "Tem alguma música que sempre melhora seu dia?"] ,
      "Viagens": ["Tem algum lugar que ainda está na sua lista de sonhos?", "Qual destino você gostaria de conhecer agora?", "Você prefere viajar para descansar ou viver uma aventura?"] ,
      "Praia": ["Você prefere praia para relaxar ou para curtir?", "Qual praia você voltaria sem pensar duas vezes?", "O que não pode faltar em um dia perfeito na praia?"] ,
      "Natureza": ["Você prefere uma trilha ou um lugar tranquilo para ficar?", "Qual lugar na natureza você gostaria de conhecer?", "Você curte mais montanha, praia ou cachoeira?"] ,
      "Games": ["Qual jogo você mais recomenda para alguém conhecer?", "Qual jogo você consegue jogar por horas?", "Você prefere jogar sozinho ou com amigos?"] ,
      "Filmes e séries": ["Tem algum filme ou série que você sempre reassiste?", "Qual série você indicaria sem medo de errar?", "Você é mais de filme ou série?"] ,
      "Gastronomia": ["Qual lugar você indicaria para comer bem?", "Qual comida você escolheria para um jantar especial?", "Qual restaurante você gostaria de conhecer?"] ,
      "Culinária": ["Qual prato você faria para impressionar alguém?", "O que você mais gosta de cozinhar?", "Qual receita você aprendeu e ficou orgulhoso?"] ,
      "Animais": ["Você é mais de cachorro, gato ou os dois?", "Qual animal você teria se pudesse escolher qualquer um?", "Você tem alguma história engraçada com um animal?"] ,
      "Festas": ["Qual é o seu tipo de rolê favorito?", "Você prefere festa grande ou rolê mais tranquilo?", "Qual foi um rolê que você lembra até hoje?"] ,
      "Fotografia": ["O que você mais gosta de fotografar?", "Você fotografa mais pessoas, lugares ou momentos?", "Qual foto sua você mais gosta?"] ,
      "Tecnologia": ["Qual tecnologia você acha que mudou mais sua rotina?", "Qual aplicativo você usa todos os dias?", "Tem alguma tecnologia que você gostaria de experimentar?"] ,
      "Cinema": ["Qual filme você indicaria para uma noite tranquila?", "Qual filme você gostaria de rever no cinema?", "Qual gênero de filme mais combina com você?"] ,
      "Moda": ["Você gosta de montar looks ou vai no básico?", "Qual peça você mais gosta de usar?", "Seu estilo muda dependendo do lugar?"] ,
      "Negócios": ["Você tem algum projeto ou ideia que gostaria de tirar do papel?", "Você gosta mais de criar ou executar ideias?", "Qual negócio você teria vontade de abrir?"] ,
      "Finanças": ["Você é mais de guardar, investir ou aproveitar?", "Você gosta de planejar o dinheiro ou prefere ir vivendo?", "Tem algum objetivo financeiro que você está buscando?"] ,
      "Espiritualidade": ["O que costuma deixar seu dia mais leve?", "O que te ajuda a manter a cabeça tranquila?", "Existe algum hábito que te traz paz?"] ,
      "Inglês": ["Você aprendeu inglês por estudo, viagem ou por conta própria?", "Você gosta de consumir conteúdo em inglês?", "Qual lugar você gostaria de conhecer para praticar inglês?"] ,
      "Espanhol": ["Você gostaria de conhecer algum país de língua espanhola?", "Você aprendeu espanhol por estudo ou por interesse?", "Qual país da América Latina você teria vontade de conhecer?"] ,
      "Francês": ["Qual lugar da França você gostaria de conhecer?", "Você curte a cultura francesa?", "Você teria vontade de aprender francês?"] ,
      "Italiano": ["Você teria vontade de conhecer a Itália?", "Qual cidade italiana você gostaria de conhecer?", "Você gosta mais de comida, cultura ou paisagens da Itália?"] ,
      "Alemão": ["Você gostaria de conhecer algum lugar onde se fala alemão?", "Você teria vontade de aprender alemão?", "Qual cidade da Alemanha você gostaria de conhecer?"] ,
      "Libras": ["Como você conheceu a Libras?", "Você usa Libras no dia a dia?", "O que despertou seu interesse por Libras?"] ,
      "Relacionamento": ["O que faz uma conexão valer a pena para você?", "O que você mais valoriza quando conhece alguém?", "Para você, o que deixa uma relação leve?"] ,
      "Conhecer": ["O que mais chamou sua atenção no MOON?", "O que você gostaria de encontrar por aqui?", "Que tipo de pessoa costuma despertar sua curiosidade?"] ,
      "Casual": ["Qual seria um rolê perfeito para sair da rotina?", "Você prefere algo planejado ou espontâneo?", "O que torna um encontro casual divertido para você?"] ,
      "Amizade": ["O que faz você querer manter alguém por perto?", "O que você mais valoriza em uma amizade?", "Você é do tipo que faz amizade rápido?"] ,
      "Conversar": ["Qual assunto sempre consegue prender sua atenção?", "Sobre o que você poderia conversar por horas?", "Que assunto faz você esquecer da hora?"] ,
      "Ainda não sei": ["O que faria uma conversa aqui ficar realmente boa?", "O que você espera descobrir por aqui?", "Você prefere deixar as coisas acontecerem naturalmente?"] ,
    };

    const options = questions[connection];
    if (!options) return `E o que mais você curte em ${connection}?`;
    return options[Math.floor(Math.random() * options.length)];
  }

  function getDeepFollowUpForConnection(connection) {
    const questions = {
      "Música": ["Se vocês pudessem ir juntos a um show, quem você escolheria ver?", "Qual música você colocaria para marcar um momento especial?", "Qual artista você gostaria de descobrir junto com alguém?"] ,
      "Viagens": ["Qual viagem você faria de novo sem pensar duas vezes?", "Que destino teria tudo a ver com vocês dois?", "Se pudesse embarcar amanhã, para onde iria?"] ,
      "Praia": ["Qual seria o seu dia perfeito na praia com alguém?", "Você escolheria nascer do sol ou pôr do sol na praia?", "Qual praia seria perfeita para um rolê a dois?"] ,
      "Natureza": ["Qual lugar você gostaria de conhecer acompanhado?", "Você toparia uma aventura na natureza com alguém?", "Qual seria o passeio perfeito ao ar livre?"] ,
      "Games": ["Qual jogo você gostaria de jogar com alguém?", "Você ensinaria seu jogo favorito para alguém?", "Qual seria o jogo perfeito para uma noite juntos?"] ,
      "Filmes e séries": ["Qual filme você assistiria com alguém numa noite perfeita?", "Que série vocês poderiam começar juntos?", "Qual filme diz muito sobre o seu gosto?"] ,
      "Gastronomia": ["Qual experiência gastronômica você gostaria de viver com alguém?", "Qual lugar seria perfeito para um jantar a dois?", "Você escolheria um restaurante novo ou seu lugar favorito?"] ,
      "Culinária": ["Qual prato você gostaria de preparar junto com alguém?", "Você toparia cozinhar em dupla? O que fariam?", "Qual receita seria divertida de fazer juntos?"] ,
      "Animais": ["Você toparia um rolê que envolvesse animais?", "Qual passeio com animais você gostaria de fazer?", "Você teria um pet junto com alguém?"] ,
      "Festas": ["Qual seria o rolê perfeito para vocês dois?", "Vocês seriam os primeiros a chegar ou os últimos a sair?", "Qual tipo de festa combinaria com vocês?"] ,
      "Fotografia": ["Que lugar você gostaria de fotografar acompanhado?", "Você curtiria fazer um passeio só para fotografar juntos?", "Que momento você gostaria de registrar com alguém?"] ,
      "Tecnologia": ["Que tecnologia você gostaria de experimentar com alguém?", "Qual gadget você gostaria de testar junto?", "Que novidade tecnológica mais te deixa curioso?"] ,
      "Cinema": ["Qual filme seria perfeito para assistir juntos?", "Qual sessão de cinema você escolheria para um encontro?", "Você escolheria filme conhecido ou uma descoberta nova?"] ,
      "Moda": ["Você curtiria montar um look para um encontro?", "Você pediria opinião de alguém para escolher uma roupa?", "Qual seria o estilo de um encontro perfeito para você?"] ,
      "Negócios": ["Você gostaria de construir algum projeto com alguém?", "Que ideia você adoraria tirar do papel acompanhado?", "Você trabalharia bem em dupla com alguém que combina com você?"] ,
      "Finanças": ["Qual seria uma experiência que você gostaria de viver com alguém?", "Você gosta de planejar uma viagem ou experiência juntos?", "Qual sonho você gostaria de realizar acompanhado?"] ,
      "Espiritualidade": ["O que você gostaria de compartilhar com alguém que te faz bem?", "Que hábito de paz você gostaria de viver acompanhado?", "O que torna uma conexão especial para você?"] ,
      "Inglês": ["Qual lugar você gostaria de conhecer para praticar inglês?", "Você toparia uma viagem para praticar inglês juntos?", "Que filme ou série em inglês vocês poderiam assistir juntos?"] ,
      "Espanhol": ["Qual país você conheceria acompanhado?", "Você faria uma viagem pela América Latina com alguém?", "Qual cidade de língua espanhola seria um bom destino a dois?"] ,
      "Francês": ["Que lugar você gostaria de conhecer na França?", "Você toparia uma viagem para praticar francês?", "Qual experiência francesa você gostaria de viver?"] ,
      "Italiano": ["Qual seria o seu roteiro ideal pela Itália?", "Qual cidade italiana seria perfeita para conhecer acompanhado?", "Você faria uma viagem gastronômica pela Itália?"] ,
      "Alemão": ["Qual lugar de língua alemã você gostaria de conhecer?", "Você faria uma viagem pela Alemanha acompanhado?", "Qual cidade alemã despertaria sua curiosidade?"] ,
      "Libras": ["Que experiência você gostaria de compartilhar usando Libras?", "Você gostaria de aprender mais Libras junto com alguém?", "Que situação seria legal vivenciar usando Libras?"] ,
      "Relacionamento": ["O que você gostaria de construir com alguém que combina com você?", "O que faz você sentir que existe uma conexão de verdade?", "Que tipo de relação faria sentido para você hoje?"] ,
      "Conhecer": ["O que faria você querer continuar conhecendo alguém?", "O que precisa acontecer para uma conversa virar vontade de se encontrar?", "Que detalhe faz você querer conhecer alguém melhor?"] ,
      "Casual": ["Qual seria um encontro leve e sem roteiro para você?", "Que tipo de encontro espontâneo você toparia?", "O que faria um encontro casual ficar inesquecível?"] ,
      "Amizade": ["Que tipo de amizade você gostaria de encontrar aqui?", "Qual rolê você faria com um novo amigo?", "O que faz uma amizade sair do superficial?"] ,
      "Conversar": ["Que assunto você poderia conversar por horas com alguém?", "Qual conversa você gostaria de ter hoje?", "O que faz você querer continuar uma conversa?"] ,
      "Ainda não sei": ["O que faria você perceber que vale a pena continuar essa conversa?", "Você prefere descobrir a conexão aos poucos?", "O que faria você querer conhecer alguém pessoalmente?"] ,
    };

    const options = questions[connection];
    if (!options) return `O que você gostaria de viver relacionado a ${connection}?`;
    return options[Math.floor(Math.random() * options.length)];
  }

  function getIcebreakerForConnection(connection) {
    const questions = {
      "Música": ["Qual música você não cansa de ouvir?", "Que música você colocaria para começar uma conversa?", "Qual artista você sempre acaba ouvindo?"] ,
      "Viagens": ["Qual lugar você mais gostou de conhecer?", "Qual destino está no topo da sua lista?", "Qual viagem mais marcou você?"] ,
      "Praia": ["Qual é a sua praia favorita?", "Você tem uma praia que considera especial?", "Praia para relaxar ou para curtir?"] ,
      "Natureza": ["Qual lugar na natureza você gostaria de conhecer?", "Você prefere trilha, cachoeira ou praia?", "Qual lugar ao ar livre você mais gosta?"] ,
      "Games": ["Qual jogo você mais gosta de jogar?", "Qual jogo você indicaria para alguém?", "Qual game sempre te prende?"] ,
      "Filmes e séries": ["Qual filme ou série você recomenda?", "Qual série você terminou e amou?", "Qual filme você sempre indica?"] ,
      "Gastronomia": ["Qual comida você escolheria para um jantar perfeito?", "Qual comida você nunca enjoa?", "Qual lugar você mais gosta de comer?"] ,
      "Culinária": ["Você gosta de cozinhar? O que faz de melhor?", "Qual prato você sabe fazer muito bem?", "Você cozinha mais por hobby ou necessidade?"] ,
      "Animais": ["Você tem algum animal de estimação?", "Você é mais de cachorro ou gato?", "Qual animal você gostaria de ter?"] ,
      "Festas": ["Você é mais de festa ou de um rolê tranquilo?", "Qual é o seu tipo de festa favorito?", "Você curte sair ou prefere um rolê mais reservado?"] ,
      "Fotografia": ["Você gosta de fotografar o quê?", "O que mais chama sua atenção para fotografar?", "Você gosta mais de foto de pessoas ou lugares?"] ,
      "Tecnologia": ["Qual tecnologia você não vive sem?", "Qual aplicativo você mais usa?", "Você curte testar novidades tecnológicas?"] ,
      "Cinema": ["Qual filme você viu recentemente e gostou?", "Qual filme você poderia rever várias vezes?", "Qual gênero você mais gosta no cinema?"] ,
      "Moda": ["Você curte moda ou escolhe mais pelo conforto?", "Como você definiria seu estilo?", "Tem alguma peça que você sempre usa?"] ,
      "Negócios": ["Você gosta de conversar sobre negócios e ideias?", "Você tem alguma ideia de negócio?", "Você se imagina empreendendo algum dia?"] ,
      "Finanças": ["Você curte falar sobre dinheiro e investimentos?", "Você gosta de planejar suas finanças?", "Você é mais de guardar ou aproveitar?"] ,
      "Espiritualidade": ["O que traz paz para você?", "Você tem algum hábito que te ajuda a desacelerar?", "O que costuma deixar seu dia melhor?"] ,
      "Inglês": ["Você costuma usar inglês no dia a dia?", "Você gosta de consumir coisas em inglês?", "Como você começou a aprender inglês?"] ,
      "Espanhol": ["Você fala espanhol ou está aprendendo?", "Você gosta de ouvir espanhol?", "Qual país de língua espanhola você gostaria de conhecer?"] ,
      "Francês": ["Você gosta da cultura francesa?", "Você teria vontade de conhecer a França?", "Você já estudou francês?"] ,
      "Italiano": ["Você fala italiano ou tem vontade de aprender?", "Você teria vontade de conhecer a Itália?", "Você gosta da cultura italiana?"] ,
      "Alemão": ["Você fala alemão ou está aprendendo?", "Você teria vontade de conhecer a Alemanha?", "O que mais te chama atenção na cultura alemã?"] ,
      "Libras": ["Você já teve contato com Libras?", "O que despertou seu interesse por Libras?", "Você gostaria de aprender mais Libras?"] ,
      "Relacionamento": ["O que você procura conhecer por aqui?", "O que você mais valoriza em uma conexão?", "O que faz você se interessar por alguém?"] ,
      "Conhecer": ["O que fez você entrar no MOON?", "O que você espera encontrar por aqui?", "O que te fez querer conhecer pessoas novas?"] ,
      "Casual": ["O que você gosta de fazer quando quer sair da rotina?", "Qual seria um rolê espontâneo perfeito?", "O que costuma te tirar da rotina?"] ,
      "Amizade": ["O que você valoriza em uma amizade?", "O que faz você confiar em alguém?", "Você costuma fazer amizade rápido?"] ,
      "Conversar": ["Sobre o que você poderia conversar por horas?", "Qual assunto nunca fica chato para você?", "Que tipo de conversa prende sua atenção?"] ,
      "Ainda não sei": ["O que você espera encontrar por aqui?", "O que você gostaria de descobrir no MOON?", "Você prefere deixar a conexão acontecer naturalmente?"] ,
    };

    const options = questions[connection];
    if (!options) return `Vi que vocês também têm interesse em ${connection}. Quer conversar sobre isso?`;
    return options[Math.floor(Math.random() * options.length)];
  }

  async function openProfileDetails(profile) {
    if (!profile?.id) return;

    if (await isUserBlocked(profile.id)) {
      setMessage("ESTA CONTA ESTÁ INDISPONÍVEL");
      setSelectedProfile(null);
      setSelectedProfilePhotos([]);
      setShowSelectedProfileMenu(false);
      return;
    }

    // O perfil já vem completo da descoberta/mapa. Abrimos imediatamente,
    // enquanto carregamos apenas as fotos adicionais.
    setSelectedProfile(profile);
    setShowSelectedProfileMenu(false);
    setSelectedProfilePhotos([]);
    setSelectedProfileLoading(false);

    const { data: { user: viewer } } = await supabase.auth.getUser();

    if (viewer?.id && viewer.id !== profile.id) {
      await supabase.from("profile_views").insert({
        viewer_id: viewer.id,
        profile_id: profile.id,
      });
    }

    try {
      // Carrega os dados completos do usuário separadamente, sem bloquear a abertura do modal.
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profile.id)
        .maybeSingle();

      if (profileError) {
        console.error("ERRO AO CARREGAR DADOS DO PERFIL:", profileError);
      }

      if (profileData) {
        setSelectedProfile((current) => ({
          ...current,
          ...profileData,
        }));
      }

      const { data: photoData, error: photoError } = await supabase
        .from("profile_photos")
        .select("id, storage_path, is_primary")
        .eq("user_id", profile.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });

      if (photoError) {
        console.error("ERRO AO CARREGAR FOTOS DO PERFIL:", photoError);
        return;
      }

      const photosWithUrl = (photoData || []).map((photo) => {
        const { data: publicData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(photo.storage_path);

        return {
          ...photo,
          publicUrl: publicData?.publicUrl || null,
        };
      });

      setSelectedProfilePhotos(photosWithUrl);
    } catch (error) {
      console.error("ERRO AO CARREGAR PERFIL:", error);
    }
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

      const { data: { user } } = await supabase.auth.getUser();
      const blockedIds = await getBlockedUserIds(user?.id);
      const visibleProfiles = profiles.filter((profile) => !blockedIds.has(profile.id) && profile.is_hidden !== true);

      const visibleProfileIds = visibleProfiles.map((profile) => profile.id).filter(Boolean);

      // Busca somente boosts ativos e ainda válidos para priorizar perfis impulsionados.
      let activeBoostIds = new Set();
      if (visibleProfileIds.length > 0) {
        const nowIso = new Date().toISOString();
        const { data: activeBoosts, error: boostError } = await supabase
          .from("profile_boosts")
          .select("user_id, starts_at, expires_at, status")
          .in("user_id", visibleProfileIds)
          .eq("status", "active")
          .eq("active", true)
          .gt("expires_at", nowIso)
          .lte("starts_at", nowIso);

        if (boostError) {
          throw boostError;
        }

        activeBoostIds = new Set((activeBoosts || []).map((boost) => boost.user_id).filter(Boolean));
      }

      let profileDetailsMap = new Map();

      if (visibleProfileIds.length > 0) {
        const { data: profileDetails, error: profileDetailsError } = await supabase
          .from("profiles")
          .select("id, profession, education, intention, habits, hobbies, personality, relationship, interests, languages")
          .in("id", visibleProfileIds);

        if (profileDetailsError) {
          throw profileDetailsError;
        }

        profileDetailsMap = new Map((profileDetails || []).map((profile) => [profile.id, profile]));
      }

      const enrichedVisibleProfiles = visibleProfiles
        .map((profile) => ({
          ...profile,
          ...(profileDetailsMap.get(profile.id) || {}),
          isBoosted: activeBoostIds.has(profile.id),
        }))
        .sort((a, b) => {
          if (a.isBoosted === b.isBoosted) return 0;
          return a.isBoosted ? -1 : 1;
        });

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
          enrichedVisibleProfiles.map(
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
      return "OFFLINE";
    }

    const lastActive =
      new Date(
        lastActiveAt
      ).getTime();

    if (!Number.isFinite(lastActive)) {
      return "OFFLINE";
    }

    const now = statusClock;
    const difference =
      Math.max(0, now - lastActive);

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 2) {
      return "ATIVO AGORA";
    }

    if (minutes < 60) {
      return `ONLINE HÁ ${minutes} ${minutes === 1 ? "MINUTO" : "MINUTOS"}`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `ONLINE HÁ ${hours} ${hours === 1 ? "HORA" : "HORAS"}`;
    }

    const days = Math.floor(hours / 24);

    return `ONLINE HÁ ${days} ${days === 1 ? "DIA" : "DIAS"}`;
  }

  // Proteção de captura para fotos de perfil e mídias temporárias.
  // A web não oferece uma API confiável para bloquear 100% screenshots/gravações.
  // Por isso, o MOON esconde imediatamente o conteúdo protegido quando a página
  // perde visibilidade ou foco e bloqueia as formas comuns de salvar/arrastar a mídia.
  useEffect(() => {
    const hideProtectedContent = () => setCaptureShieldActive(true);
    const showProtectedContent = () => {
      if (document.visibilityState === "visible") setCaptureShieldActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") hideProtectedContent();
      else showProtectedContent();
    };

    const handleBlur = () => hideProtectedContent();
    const handleFocus = () => showProtectedContent();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const protectedMediaProps = {
    draggable: false,
    onContextMenu: (event) => event.preventDefault(),
    onDragStart: (event) => event.preventDefault(),
    onSelect: (event) => event.preventDefault(),
  };

  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;
    let lastHeartbeatAt = 0;

    const updateLastActive = async (force = false) => {
      if (cancelled || document.visibilityState === "hidden") return;

      const now = Date.now();

      if (!force && now - lastHeartbeatAt < 15000) return;

      lastHeartbeatAt = now;
      const activeAt = new Date(now).toISOString();

      const { error } = await supabase
        .from("profiles")
        .update({
          last_active_at: activeAt,
        })
        .eq("id", currentUserId);

      if (error) {
        console.error("ERRO AO ATUALIZAR STATUS ATIVO:", error);
        return;
      }

      setStatusClock(now);
    };

    const handleUserActivity = () => {
      updateLastActive(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateLastActive(true);
      }
    };

    const handleWindowFocus = () => {
      updateLastActive(true);
    };

    updateLastActive(true);

    const heartbeatInterval = window.setInterval(() => {
      updateLastActive(true);
    }, 20000);

    const clockInterval = window.setInterval(() => {
      setStatusClock(Date.now());
    }, 5000);

    window.addEventListener("pointerdown", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity);
    window.addEventListener("touchstart", handleUserActivity, { passive: true });
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(heartbeatInterval);
      window.clearInterval(clockInterval);
      window.removeEventListener("pointerdown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId || screen !== "inside") return;

    let cancelled = false;

    const refreshVisibleProfileStatuses = async () => {
      try {
        const profileIds = Array.from(
          new Set([
            ...nearbyProfiles,
            ...likedProfiles,
            ...viewedProfiles,
            ...conversations.map((conversation) => conversation.profile).filter(Boolean),
            selectedProfile,
          ].map((profile) => profile?.id).filter(Boolean))
        );

        if (!profileIds.length) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("id, last_active_at")
          .in("id", profileIds);

        if (error) {
          console.error("ERRO AO ATUALIZAR STATUS DOS PERFIS:", error);
          return;
        }

        if (cancelled || !data?.length) return;

        const statusMap = new Map(
          data.map((profile) => [profile.id, profile.last_active_at])
        );

        const mergeStatus = (profile) => {
          if (!profile?.id || !statusMap.has(profile.id)) return profile;
          return {
            ...profile,
            last_active_at: statusMap.get(profile.id),
          };
        };

        setNearbyProfiles((current) => current.map(mergeStatus));
        setLikedProfiles((current) => current.map(mergeStatus));
        setViewedProfiles((current) => current.map(mergeStatus));
        setConversations((current) =>
          current.map((conversation) =>
            conversation.profile
              ? { ...conversation, profile: mergeStatus(conversation.profile) }
              : conversation
          )
        );
        setSelectedProfile((current) => mergeStatus(current));
        setStatusClock(Date.now());
      } catch (error) {
        console.error("ERRO AO ATUALIZAR STATUS DOS PERFIS:", error);
      }
    };

    refreshVisibleProfileStatuses();
    const statusRefreshInterval = window.setInterval(
      refreshVisibleProfileStatuses,
      15000
    );

    return () => {
      cancelled = true;
      window.clearInterval(statusRefreshInterval);
    };
  }, [currentUserId, screen, nearbyProfiles.length, likedProfiles.length, viewedProfiles.length, conversations.length, selectedProfile?.id]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`moon-profile-status-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          const updatedProfile = payload.new;

          if (!updatedProfile?.id) return;

          setNearbyProfiles((current) =>
            current.map((profile) =>
              profile.id === updatedProfile.id
                ? { ...profile, ...updatedProfile }
                : profile
            )
          );

          setConversations((current) =>
            current.map((conversation) =>
              conversation.profile?.id === updatedProfile.id
                ? {
                    ...conversation,
                    profile: {
                      ...conversation.profile,
                      ...updatedProfile,
                    },
                  }
                : conversation
            )
          );

          setLikedProfiles((current) =>
            current.map((profile) =>
              profile.id === updatedProfile.id
                ? { ...profile, ...updatedProfile }
                : profile
            )
          );

          setViewedProfiles((current) =>
            current.map((profile) =>
              profile.id === updatedProfile.id
                ? { ...profile, ...updatedProfile }
                : profile
            )
          );

          setSelectedProfile((current) =>
            current?.id === updatedProfile.id
              ? { ...current, ...updatedProfile }
              : current
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (
      !currentUserId ||
      screen !== "inside" ||
      userLocation.latitude === null ||
      userLocation.longitude === null
    ) {
      return;
    }

    const refreshDiscoveryStatuses = window.setInterval(() => {
      if (document.visibilityState !== "hidden") {
        loadNearbyProfiles(
          userLocation.latitude,
          userLocation.longitude
        );
      }
    }, 60000);

    return () => {
      window.clearInterval(refreshDiscoveryStatuses);
    };
  }, [
    currentUserId,
    screen,
    userLocation.latitude,
    userLocation.longitude,
  ]);

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
          : name === "name"
            ? value.slice(0, 8)
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

  async function loadMapProfiles(latitude, longitude, radiusKm) {
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
      setMapProfiles([]);
      return;
    }

    setMapProfilesLoading(true);

    try {
      const { data, error } = await supabase.rpc(
        "get_nearby_profiles",
        {
          user_lat: latitude,
          user_lng: longitude,
          max_distance_km: radiusKm,
        }
      );

      if (error) throw error;

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const blockedIds = await getBlockedUserIds(currentUser?.id);
      const visibleProfiles = (data || []).filter((profile) =>
        profile.id !== currentUser?.id &&
        !blockedIds.has(profile.id) &&
        profile.is_hidden !== true &&
        profile.latitude !== null &&
        profile.latitude !== undefined &&
        profile.longitude !== null &&
        profile.longitude !== undefined
      );

      setMapProfiles(visibleProfiles);
    } catch (error) {
      console.error("ERRO AO CARREGAR PERFIS DO MAPA:", error);
      setMapProfiles([]);
    } finally {
      setMapProfilesLoading(false);
    }
  }

  useEffect(() => {
    if (screen !== "map") return;

    const center = selectedMapPoint || (
      userLocation.latitude !== null && userLocation.longitude !== null
        ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
        : null
    );

    if (!center) {
      setMapProfiles([]);
      return;
    }

    loadMapProfiles(center.latitude, center.longitude, mapRadius);
  }, [screen, selectedMapPoint, userLocation.latitude, userLocation.longitude, mapRadius]);

  async function handleMapProfileSelect(profile) {
    if (!profile?.id) return;

    if (await isUserBlocked(profile.id)) {
      setMessage("ESTA CONTA ESTÁ INDISPONÍVEL");
      setSelectedMapProfile(null);
      setSelectedMapProfileLoading(false);
      return;
    }

    setSelectedMapProfileLoading(true);
    setSelectedMapProfile({ ...profile, photoUrl: null });

    try {
      const { data: photoData, error: photoError } = await supabase
        .from("profile_photos")
        .select("storage_path, is_primary")
        .eq("user_id", profile.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(1);

      if (photoError) throw photoError;

      let photoUrl = null;
      if (photoData && photoData.length > 0) {
        const { data: publicData } = supabase.storage
          .from("profile-photos")
          .getPublicUrl(photoData[0].storage_path);
        photoUrl = publicData?.publicUrl || null;
      }

      setSelectedMapProfile((current) =>
        current?.id === profile.id ? { ...current, photoUrl } : current
      );
    } catch (error) {
      console.error("ERRO AO CARREGAR FOTO DO PERFIL NO MAPA:", error);
    } finally {
      setSelectedMapProfileLoading(false);
    }
  }

  async function handleViewMapProfile(profile) {
    if (!profile?.id) return;

    setShowMapProfilesPanel(false);
    setSelectedMapProfile(null);
    setSelectedMapProfileLoading(true);
    setSelectedProfileFromMap(true);
    setScreen("inside");

    try {
      const { data: profileDetails } = await supabase
        .from("profiles")
        .select("birth_date")
        .eq("id", profile.id)
        .maybeSingle();

      await openProfileDetails({
        ...profile,
        ...(profileDetails || {}),
      });
    } finally {
      setSelectedMapProfileLoading(false);
    }
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

  function openFiltersPage() {
    setFilterDraftMinAge(minAge);
    setFilterDraftMaxAge(maxAge);
    setFilterDraftIdentity(identityFilter);
    setFilterDraftSexuality(sexualityFilter);
    setFilterDraftPosition(positionFilter);
    setFilterDraftAvailability(availabilityFilter);
    setMessage("");
    setScreen("filters");
  }

  function applyFilters() {
    setMinAge(filterDraftMinAge);
    setMaxAge(filterDraftMaxAge);
    setIdentityFilter(filterDraftIdentity);
    setSexualityFilter(filterDraftSexuality);
    setPositionFilter(filterDraftPosition);
    setAvailabilityFilter(filterDraftAvailability);
    setMessage("");
    setScreen("inside");
  }

  function cancelFilters() {
    setMinAge(18);
    setMaxAge(65);
    setIdentityFilter("");
    setSexualityFilter("");
    setPositionFilter("");
    setAvailabilityFilter("");
    setFilterDraftMinAge(18);
    setFilterDraftMaxAge(65);
    setFilterDraftIdentity("");
    setFilterDraftSexuality("");
    setFilterDraftPosition("");
    setFilterDraftAvailability("");
    setMessage("");
    setScreen("inside");
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

    showToast({
      title: "Descoberta atualizada",
      body: "Os perfis próximos foram atualizados.",
    });
  }

  async function handleRefreshAll() {
    setMessage("");
    setLocationLoading(true);
    setDiscoveryLoading(true);

    if (!navigator.geolocation) {
      setMessage("Seu navegador não suporta localização.");
      setLocationLoading(false);
      setDiscoveryLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error("Usuário não encontrado.");
          }

          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const activeAt = new Date().toISOString();

          const { error } = await supabase
            .from("profiles")
            .update({
              latitude,
              longitude,
              last_active_at: activeAt,
              updated_at: activeAt,
            })
            .eq("id", user.id);

          if (error) {
            throw error;
          }

          setLocationSaved(true);
          setUserLocation({ latitude, longitude });

          await loadNearbyProfiles(latitude, longitude);

          showToast({
            title: "Atualizado",
            body: "Localização e descoberta foram atualizadas.",
          });
        } catch (error) {
          console.error("ERRO AO ATUALIZAR LOCALIZAÇÃO E DISCOVERY:", error);
          setMessage(
            error.message ||
            "Não foi possível atualizar sua localização e a descoberta."
          );
        } finally {
          setLocationLoading(false);
          setDiscoveryLoading(false);
        }
      },
      (error) => {
        console.error("ERRO DE GEOLOCALIZAÇÃO:", error);

        if (error.code === 1) {
          setMessage("Permita o acesso à localização para continuar.");
        } else if (error.code === 2) {
          setMessage("Não foi possível encontrar sua localização.");
        } else if (error.code === 3) {
          setMessage("A localização demorou muito para responder.");
        } else {
          setMessage("Não foi possível obter sua localização.");
        }

        setLocationLoading(false);
        setDiscoveryLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }


  function isValidUuid(value) {
    return typeof value === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  async function getBlockedUserIds(userId = null) {
    try {
      let currentId = userId || currentUserId;

      if (!isValidUuid(currentId)) {
        const { data: { user } } = await supabase.auth.getUser();
        currentId = user?.id || null;
      }

      if (!isValidUuid(currentId)) {
        return new Set();
      }

      const { data, error } = await supabase
        .from("blocked_users")
        .select("user_id, blocked_user_id")
        .or(`user_id.eq.${currentId},blocked_user_id.eq.${currentId}`);

      if (error) throw error;

      const blockedIds = new Set();

      (data || []).forEach((row) => {
        if (row.user_id === currentId && isValidUuid(row.blocked_user_id)) {
          blockedIds.add(row.blocked_user_id);
        }

        if (row.blocked_user_id === currentId && isValidUuid(row.user_id)) {
          blockedIds.add(row.user_id);
        }
      });

      return blockedIds;
    } catch (error) {
      console.error("ERRO AO CARREGAR BLOQUEIOS BIDIRECIONAIS:", error);
      return new Set();
    }
  }

  async function isUserBlocked(blockedUserId, userId = null) {
    if (!isValidUuid(blockedUserId)) return false;

    try {
      let currentId = userId || currentUserId;

      if (!isValidUuid(currentId)) {
        const { data: { user } } = await supabase.auth.getUser();
        currentId = user?.id || null;
      }

      if (!isValidUuid(currentId) || currentId === blockedUserId) return false;

      if (blockedUsers.some((item) => item.id === blockedUserId)) {
        return true;
      }

      const blockedIds = await getBlockedUserIds(currentId);
      return blockedIds.has(blockedUserId);
    } catch (error) {
      console.error("ERRO AO VERIFICAR BLOQUEIO:", error);
      return false;
    }
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

      setNearbyProfiles((current) =>
        current.filter((profile) => !blockedIds.includes(profile.id))
      );
      setMapProfiles((current) =>
        current.filter((profile) => !blockedIds.includes(profile.id))
      );
      setLikedProfiles((current) =>
        current.filter((profile) => !blockedIds.includes(profile.id))
      );
      setViewedProfiles((current) =>
        current.filter((profile) => !blockedIds.includes(profile.id))
      );
      // Conversas existentes permanecem no histórico mesmo após o bloqueio.
      // O bloqueio impede novas interações, mas não apaga a conversa.
    } catch (error) {
      console.error("ERRO AO CARREGAR BLOQUEADOS:", error);
      setMessage("Não foi possível carregar os usuários bloqueados.");
    } finally {
      setBlockedUsersLoading(false);
    }
  }

  useEffect(() => {
    if (screen === "settings" && currentUserId) {
      loadBlockedUsers();
    }
  }, [screen, currentUserId]);

  useEffect(() => {
    if (!currentUserId) {
      setPinnedConversationIds([]);
      return;
    }

    try {
      const stored = window.localStorage.getItem(
        `moon_pinned_conversations_${currentUserId}`
      );
      const parsed = stored ? JSON.parse(stored) : [];
      setPinnedConversationIds(
        Array.isArray(parsed) ? parsed.filter(Boolean) : []
      );
    } catch (error) {
      console.error("ERRO AO CARREGAR CONVERSAS FIXADAS:", error);
      setPinnedConversationIds([]);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!isValidUuid(currentUserId)) return;

    const removeBlockedUserFromInterface = (otherUserId) => {
      if (!isValidUuid(otherUserId) || otherUserId === currentUserId) return;

      setNearbyProfiles((current) =>
        current.filter((item) => item.id !== otherUserId)
      );
      setMapProfiles((current) =>
        current.filter((item) => item.id !== otherUserId)
      );
      setLikedProfiles((current) =>
        current.filter((item) => item.id !== otherUserId)
      );
      setViewedProfiles((current) =>
        current.filter((item) => item.id !== otherUserId)
      );
      // A conversa existente permanece no histórico. O bloqueio será
      // aplicado às ações de abrir perfil e enviar novas mensagens.
      if (chatTarget?.id === otherUserId) {
        setChatTarget(null);
        setChatConversation(null);
        setChatBlocked(false);
        setChatMessages([]);
        setChatText("");
        setChatReplyToMessage(null);
        setChatTyping(false);
        setShowChatMenu(false);
        setScreen("inside");
      }

      if (selectedProfile?.id === otherUserId) {
        setSelectedProfile(null);
        setSelectedProfilePhotos([]);
        setShowSelectedProfileMenu(false);
      }

      if (selectedMapProfile?.id === otherUserId) {
        setSelectedMapProfile(null);
        setSelectedMapProfileLoading(false);
      }
    };

    const channel = supabase
      .channel(`moon-blocks-${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "blocked_users",
        },
        (payload) => {
          const row = payload?.new;
          if (!row) return;

          const affectsCurrentUser =
            row.user_id === currentUserId ||
            row.blocked_user_id === currentUserId;

          if (!affectsCurrentUser) return;

          const otherUserId =
            row.user_id === currentUserId
              ? row.blocked_user_id
              : row.user_id;

          removeBlockedUserFromInterface(otherUserId);
        }
      )
      .subscribe();

    const directBlockChannel = supabase
      .channel(`moon-direct-block-${currentUserId}`)
      .on(
        "broadcast",
        { event: "user_blocked" },
        (payload) => {
          const blockedUserId = payload?.payload?.blockedUserId;

          if (!isValidUuid(blockedUserId) || blockedUserId !== currentUserId) {
            return;
          }

          const blockerId = payload?.payload?.blockerId;
          if (!isValidUuid(blockerId) || blockerId === currentUserId) return;

          removeBlockedUserFromInterface(blockerId);
          showToast({
            icon: "⊘",
            title: "Usuário bloqueado",
            body: "Este perfil não está mais disponível para você.",
          });
        }
      )
      .subscribe();

    // Canal global: garante que quem foi bloqueado também perca imediatamente
    // o acesso visual ao perfil de quem realizou o bloqueio.
    const globalBlockChannel = supabase
      .channel("moon-block-events")
      .on(
        "broadcast",
        { event: "user_blocked" },
        (payload) => {
          const blockedUserId = payload?.payload?.blockedUserId;
          const blockerId = payload?.payload?.blockerId;

          if (blockedUserId !== currentUserId) return;
          if (!isValidUuid(blockerId) || blockerId === currentUserId) return;

          removeBlockedUserFromInterface(blockerId);
          setBlockedUsers((current) => {
            if (current.some((item) => item.id === blockerId)) return current;
            return [
              ...current,
              { id: blockerId, name: "Usuário", birth_date: null },
            ];
          });
        }
      )
      .on(
        "broadcast",
        { event: "user_unblocked" },
        async (payload) => {
          const unblockedUserId = payload?.payload?.unblockedUserId;
          const unblockerId = payload?.payload?.unblockerId;

          if (unblockedUserId !== currentUserId) return;
          if (!isValidUuid(unblockerId) || unblockerId === currentUserId) return;

          setChatBlocked(false);

          if (
            userLocation.latitude !== null &&
            userLocation.longitude !== null
          ) {
            await Promise.all([
              loadNearbyProfiles(
                userLocation.latitude,
                userLocation.longitude
              ),
              loadMapProfiles(
                userLocation.latitude,
                userLocation.longitude,
                mapRadius
              ),
            ]);
          }

          await Promise.all([
            loadLikedProfiles(),
            loadMatchedProfiles(),
            loadConversations(),
            loadBlockedUsers(),
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "blocked_users",
        },
        async (payload) => {
          const row = payload?.old;
          if (!row) return;

          const affectsCurrentUser =
            row.user_id === currentUserId ||
            row.blocked_user_id === currentUserId;

          if (!affectsCurrentUser) return;

          const otherUserId =
            row.user_id === currentUserId
              ? row.blocked_user_id
              : row.user_id;

          if (!isValidUuid(otherUserId) || otherUserId === currentUserId) return;

          setBlockedUsers((current) =>
            current.filter((item) => item.id !== otherUserId)
          );

          if (userLocation.latitude !== null && userLocation.longitude !== null) {
            await Promise.all([
              loadNearbyProfiles(userLocation.latitude, userLocation.longitude),
              loadMapProfiles(
                userLocation.latitude,
                userLocation.longitude,
                mapRadius
              ),
            ]);
          }

          await Promise.all([
            loadLikedProfiles(),
            loadMatchedProfiles(),
            loadConversations(),
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(directBlockChannel);
      supabase.removeChannel(globalBlockChannel);
    };
  }, [currentUserId, chatTarget?.id, selectedProfile?.id, selectedMapProfile?.id]);

  async function handleUnblock(profile) {
    if (!profile?.id) return;

    const confirmUnblock = window.confirm(
      `Deseja desbloquear ${profile?.name || "este usuário"}?`
    );

    if (!confirmUnblock) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado.");

      const { error } = await supabase.rpc("unblock_user", {
        p_blocked_user_id: profile.id,
      });

      if (error) throw error;

      const unblockPayload = {
        unblockerId: user.id,
        unblockedUserId: profile.id,
      };

      const directUnblockChannel = supabase.channel(
        `moon-direct-unblock-${profile.id}`
      );
      await directUnblockChannel.subscribe();
      await directUnblockChannel.send({
        type: "broadcast",
        event: "user_unblocked",
        payload: unblockPayload,
      });

      const globalUnblockChannel = supabase.channel("moon-unblock-events");
      await globalUnblockChannel.subscribe();
      await globalUnblockChannel.send({
        type: "broadcast",
        event: "user_unblocked",
        payload: unblockPayload,
      });

      window.setTimeout(() => {
        supabase.removeChannel(directUnblockChannel);
        supabase.removeChannel(globalUnblockChannel);
      }, 1500);

      setBlockedUsers((current) =>
        current.filter((item) => item.id !== profile.id)
      );

      // Se a conversa com este usuário ainda estiver aberta,
      // libera o chat imediatamente após o desbloqueio.
      if (chatTarget?.id === profile.id) {
        setChatBlocked(false);
        setMessage("");
      }

      setSelectedProfile((current) =>
        current?.id === profile.id ? null : current
      );
      setSelectedMapProfile((current) =>
        current?.id === profile.id ? null : current
      );

      showToast({
        icon: "↩",
        title: "Usuário desbloqueado",
        body: "O perfil foi desbloqueado e voltou a ficar disponível.",
      });

      const refreshTasks = [loadBlockedUsers()];

      if (userLocation.latitude !== null && userLocation.longitude !== null) {
        refreshTasks.push(
          loadNearbyProfiles(userLocation.latitude, userLocation.longitude),
          loadMapProfiles(
            userLocation.latitude,
            userLocation.longitude,
            mapRadius
          )
        );
      }

      refreshTasks.push(
        loadLikedProfiles(),
        loadMatchedProfiles(),
        loadConversations()
      );

      await Promise.all(refreshTasks);
    } catch (error) {
      console.error("ERRO AO DESBLOQUEAR USUÁRIO:", error);
      setMessage(error.message || "Não foi possível desbloquear o usuário.");
    }
  }
  async function handleBlock(profile) {
    if (!isValidUuid(profile?.id)) {
      console.error("TENTATIVA DE BLOQUEIO COM ID INVÁLIDO:", profile?.id);
      setMessage("Não foi possível bloquear este perfil porque o ID do usuário é inválido.");
      return;
    }

    const confirmBlock = window.confirm(
      `Deseja realmente bloquear ${profile?.name || "este perfil"}?`
    );

    if (!confirmBlock) return;

    setMessage("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado.");

      if (user.id === profile.id) {
        throw new Error("Você não pode bloquear seu próprio perfil.");
      }

      const { error: blockError } = await supabase.rpc("block_user", {
        p_blocked_user_id: profile.id,
      });

      if (blockError) throw blockError;

      setBlockedUsers((current) => {
        if (current.some((item) => item.id === profile.id)) return current;
        return [
          ...current,
          {
            id: profile.id,
            name: profile.name || "Usuário",
            birth_date: profile.birth_date || null,
          },
        ];
      });

      setNearbyProfiles((current) => current.filter((item) => item.id !== profile.id));
      setMapProfiles((current) => current.filter((item) => item.id !== profile.id));
      setLikedProfiles((current) => current.filter((item) => item.id !== profile.id));
      setViewedProfiles((current) => current.filter((item) => item.id !== profile.id));

      setConversations((current) =>
        current.map((conversation) =>
          conversation.profile?.id === profile.id
            ? { ...conversation, isBlocked: true }
            : conversation
        )
      );

      const wasCurrentChat =
        chatTarget?.id === profile.id ||
        (chatConversation &&
          (chatConversation.user_one_id === profile.id ||
            chatConversation.user_two_id === profile.id));

      if (wasCurrentChat) {
        setChatTarget(null);
        setChatConversation(null);
        setChatBlocked(false);
        setChatMessages([]);
        setChatText("");
        setChatReplyToMessage(null);
        setChatTyping(false);
        setShowChatMenu(false);
        setChatBlocked(false);
        setScreen("conversations");
      }

      if (selectedProfile?.id === profile.id) {
        setSelectedProfile(null);
        setSelectedProfilePhotos([]);
        setShowSelectedProfileMenu(false);
      }

      if (selectedMapProfile?.id === profile.id) {
        setSelectedMapProfile(null);
        setSelectedMapProfileLoading(false);
      }

      const blockPayload = { blockerId: user.id, blockedUserId: profile.id };
      const directBlockChannel = supabase.channel(`moon-direct-block-${profile.id}`);
      await directBlockChannel.subscribe();
      await directBlockChannel.send({ type: "broadcast", event: "user_blocked", payload: blockPayload });

      const globalBlockChannel = supabase.channel("moon-block-events");
      await globalBlockChannel.subscribe();
      await globalBlockChannel.send({ type: "broadcast", event: "user_blocked", payload: blockPayload });

      window.setTimeout(() => {
        supabase.removeChannel(directBlockChannel);
        supabase.removeChannel(globalBlockChannel);
      }, 1500);

      await loadBlockedUsers();

      showToast({
        title: "Perfil bloqueado",
        body: "A conta ficou indisponível para os dois perfis. A conversa existente foi mantida no histórico.",
      });
    } catch (error) {
      console.error("ERRO AO BLOQUEAR USUÁRIO:", error);
      setChatBlocked(false);
      setMessage(error?.message || "Não foi possível bloquear este perfil.");
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

      const description = reportDescription.trim() || null;

      const { error } = await supabase
        .from("reports")
        .insert({
          reporter_id: user.id,
          reported_user_id: profile.id,
          reason: reportReason,
          description,
        });

      if (error) throw error;

      if (reportReason === "Insistência após recusa") {
        const messageIdMatch = description?.match(/mensagem\s+([0-9a-f-]{36})/i);
        const evidenceMessageId = messageIdMatch?.[1] || null;

        const { error: abusiveEventError } = await supabase
          .from("abusive_approach_events")
          .insert({
            user_id: profile.id,
            reported_by: user.id,
            conversation_id: chatConversation?.id || null,
            evidence_message_id: evidenceMessageId,
            reason: "Insistência após recusa",
            status: "pending",
          });

        if (abusiveEventError) {
          console.error("ERRO AO REGISTRAR OCORRÊNCIA DE ABORDAGEM ABUSIVA:", abusiveEventError);
          throw abusiveEventError;
        }
      }

      if (reportReason === "Perfil falso") {
        const { error: fakeProfileEventError } = await supabase
          .from("fake_profile_events")
          .insert({
            user_id: profile.id,
            reported_by: user.id,
            conversation_id: chatConversation?.id || null,
            evidence_message_id: null,
            reason: "Perfil falso",
            details: description,
            status: "pending",
          });

        if (fakeProfileEventError) {
          console.error("ERRO AO REGISTRAR OCORRÊNCIA DE PERFIL FALSO:", fakeProfileEventError);
          throw fakeProfileEventError;
        }
      }

      setReportTarget(null);
      setReportReason("");
      setReportDescription("");
      showToast({ title: "Denúncia enviada", body: "Obrigado por ajudar a manter a MOON segura." });
    } catch (error) {
      console.error("ERRO AO DENUNCIAR PERFIL:", error);
      setMessage(error.message || "Não foi possível enviar a denúncia.");
    }
  }

  async function handleLike(profileId, profile = null) {
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

      if (!error) {
        const { data: reciprocalLike, error: reciprocalError } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", profileId)
          .eq("liked_user_id", user.id)
          .maybeSingle();

        if (reciprocalError) {
          console.error("ERRO AO VERIFICAR MATCH:", reciprocalError);
        }

        if (reciprocalLike) {
          const [userOneId, userTwoId] = [user.id, profileId].sort();

          const { error: matchError } = await supabase
            .from("matches")
            .upsert(
              {
                user_one_id: userOneId,
                user_two_id: userTwoId,
              },
              {
                onConflict: "user_one_id,user_two_id",
                ignoreDuplicates: true,
              }
            );

          if (matchError) {
            console.error("ERRO AO REGISTRAR MATCH:", matchError);
          } else {
            const { data: existingMatchNotifications, error: notificationCheckError } = await supabase
              .from("notifications")
              .select("id, user_id, actor_id")
              .eq("type", "match")
              .or(`and(user_id.eq.${profileId},actor_id.eq.${user.id}),and(user_id.eq.${user.id},actor_id.eq.${profileId})`)
              .limit(10);

            if (notificationCheckError) {
              console.error("ERRO AO VERIFICAR NOTIFICACOES DE MATCH:", notificationCheckError);
            }

            const existingPairs = new Set(
              (existingMatchNotifications || []).map((item) => `${item.user_id}:${item.actor_id}`)
            );

            const notificationsToCreate = [
              {
                user_id: profileId,
                actor_id: user.id,
                type: "match",
                is_read: false,
              },
              {
                user_id: user.id,
                actor_id: profileId,
                type: "match",
                is_read: false,
              },
            ].filter((item) => !existingPairs.has(`${item.user_id}:${item.actor_id}`));

            if (notificationsToCreate.length > 0) {
              const { error: matchNotificationError } = await supabase
                .from("notifications")
                .insert(notificationsToCreate);

              if (matchNotificationError) {
                console.error("ERRO AO CRIAR NOTIFICACOES DE MATCH:", matchNotificationError);
              }
            }
          }

          const matchedProfile =
            profile ||
            nearbyProfiles.find((item) => item.id === profileId) ||
            likedProfiles.find((item) => item.id === profileId) ||
            viewedProfiles.find((item) => item.id === profileId) ||
            selectedProfile;

          const targetPhoto =
            matchedProfile?.photoUrl ||
            selectedProfilePhotos.find((photo) => photo.is_primary)?.publicUrl ||
            selectedProfilePhotos[0]?.publicUrl ||
            null;

          const ownPhoto =
            photos.find((photo) => photo.is_primary)?.publicUrl ||
            photos[0]?.publicUrl ||
            null;

          setMatchTarget({
            profile: matchedProfile || { id: profileId, name: "Perfil" },
            targetPhoto,
            ownPhoto,
          });

          return;
        }
      }

      if (error) {
        if (
          error.code === "23505"
        ) {
          showToast({
                title: "Você já curtiu este perfil.",
            body: "Essa curtida já foi registrada.",
          });
          return;
        }

        throw error;
      }

      showToast({
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

  useEffect(() => {
    if (screen !== "chat" || !chatConversation?.id) {
      return;
    }

    const conversationId = chatConversation.id;
    let isMounted = true;

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
          const newMessage = payload.new;

          if (!isMounted || !newMessage?.id) return;

          hydrateChatMessages([newMessage]).then(([hydratedMessage]) => {
            if (!isMounted || !hydratedMessage?.id) return;

            setChatMessages((currentMessages) => {
              if (currentMessages.some((message) => message.id === hydratedMessage.id)) {
                return currentMessages;
              }

              return [...currentMessages, hydratedMessage];
            });
          });

          if (newMessage.sender_id !== currentUserId) {
            markConversationAsRead(conversationId);
          }
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
          const updatedMessage = payload.new;

          if (!isMounted || !updatedMessage?.id) return;

          setChatMessages((currentMessages) =>
            currentMessages.map((message) =>
              message.id === updatedMessage.id
                ? { ...message, ...updatedMessage }
                : message
            )
          );
        }
      )
      .on(
        "broadcast",
        {
          event: "typing",
        },
        (payload) => {
          const typingUserId = payload?.payload?.userId;

          if (!isMounted || !typingUserId || typingUserId === currentUserId) {
            return;
          }

          setChatTyping(Boolean(payload?.payload?.isTyping));
        }
      )

    chatRealtimeChannelRef.current = channel;

    channel.subscribe((status) => {
      chatChannelReadyRef.current = status === "SUBSCRIBED";
    });

    return () => {
      isMounted = false;

      if (chatTypingTimeoutRef.current) {
        clearTimeout(chatTypingTimeoutRef.current);
        chatTypingTimeoutRef.current = null;
      }

      if (chatChannelReadyRef.current && chatRealtimeChannelRef.current && currentUserId) {
        chatRealtimeChannelRef.current.send({
          type: "broadcast",
          event: "typing",
          payload: {
            userId: currentUserId,
            isTyping: false,
          },
        });
      }

      chatChannelReadyRef.current = false;
      setChatTyping(false);
      chatRealtimeChannelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [screen, chatConversation?.id, currentUserId]);

  async function hydrateChatMessages(messages) {
    const now = Date.now();

    return Promise.all(
      (messages || []).map(async (chatMessage) => {
        if (chatMessage.message_type !== "image" && chatMessage.message_type !== "video" && chatMessage.message_type !== "audio") {
          return chatMessage;
        }

        if (!chatMessage.media_url) {
          return chatMessage;
        }

        if (chatMessage.media_expires_at && new Date(chatMessage.media_expires_at).getTime() <= now) {
          return { ...chatMessage, media_signed_url: null, media_expired: true };
        }

        try {
          const bucket = chatMessage.message_type === "audio" ? "chat-audio" : "chat-media";
          const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(chatMessage.media_url, 60 * 60);

          if (error) throw error;

          return {
            ...chatMessage,
            media_signed_url: data?.signedUrl || null,
          };
        } catch (error) {
          console.error("ERRO AO GERAR URL TEMPORÁRIA DA MÍDIA:", error);
          return { ...chatMessage, media_signed_url: null };
        }
      })
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

    const hydratedMessages = await hydrateChatMessages(data || []);
    setChatMessages(hydratedMessages);
    await markConversationAsRead(conversationId);
  }

  function getConversationDistance(profile) {
    if (
      !profile ||
      profile.latitude === null ||
      profile.latitude === undefined ||
      profile.longitude === null ||
      profile.longitude === undefined ||
      userLocation.latitude === null ||
      userLocation.latitude === undefined ||
      userLocation.longitude === null ||
      userLocation.longitude === undefined
    ) {
      return null;
    }

    const toRadians = (value) => (value * Math.PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = toRadians(
      profile.latitude - userLocation.latitude
    );
    const dLon = toRadians(
      profile.longitude - userLocation.longitude
    );

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(userLocation.latitude)) *
        Math.cos(toRadians(profile.latitude)) *
        Math.sin(dLon / 2) ** 2;

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
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

      const blockedIds = await getBlockedUserIds(user.id);

      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

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

            const isBlockedConversation = blockedIds.has(otherUserId);

            const { data: profile, error: profileError } =
              await supabase
                .from("profiles")
                .select(
                  "id, name, city, birth_date, last_active_at, latitude, longitude"
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
              isBlocked: isBlockedConversation,
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

      const blockedIds = await getBlockedUserIds(user.id);

      const { data, error } = await supabase
        .from("likes")
        .select("user_id, created_at")
        .eq("liked_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const profiles = await Promise.all(
        (data || [])
          .filter((like) => !blockedIds.has(like.user_id))
          .map(async (like) => {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("id, name, city, birth_date, last_active_at")
              .eq("id", like.user_id)
              .maybeSingle();

            if (profileError || !profile || blockedIds.has(profile.id)) {
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
  async function loadMatchedProfiles() {
    setConnectionsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const blockedIds = await getBlockedUserIds(user.id);

      const { data, error } = await supabase
        .from("matches")
        .select("user_one_id, user_two_id, created_at")
        .or(`user_one_id.eq.${user.id},user_two_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const matchedUserIds = (data || [])
        .map((match) =>
          match.user_one_id === user.id
            ? match.user_two_id
            : match.user_one_id
        )
        .filter((profileId) => !blockedIds.has(profileId));

      const profiles = await Promise.all(
        matchedUserIds.map(async (profileId) => {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, name, city, birth_date, last_active_at")
            .eq("id", profileId)
            .maybeSingle();

          if (profileError || !profile || blockedIds.has(profile.id)) {
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

      setViewedProfiles(profiles.filter(Boolean));
    } catch (error) {
      console.error("ERRO AO CARREGAR MATCHES:", error);
      setMessage(error.message || "Não foi possível carregar suas conexões.");
    } finally {
      setConnectionsLoading(false);
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
    await Promise.all([loadLikedProfiles(), loadMatchedProfiles()]);
  }

  async function handleOpenConversations() {
    setMessage("");
    setScreen("conversations");
    await markNotificationsAsRead("message");
    await loadConversations();
  }

  async function loadAbusiveApproachRestriction(userId = currentUserId) {
    if (!userId) {
      setAbusiveRestrictionUntil(null);
      return null;
    }

    setAbusiveRestrictionLoading(true);

    try {
      const { data, error } = await supabase
        .from("abusive_approach_events")
        .select("confirmed_at, status")
        .eq("user_id", userId)
        .eq("status", "confirmed")
        .not("confirmed_at", "is", null)
        .order("confirmed_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const now = Date.now();
      const activeRestriction = (data || [])
        .map((event) => {
          const confirmedAt = new Date(event.confirmed_at).getTime();
          return Number.isFinite(confirmedAt)
            ? confirmedAt + 24 * 60 * 60 * 1000
            : null;
        })
        .filter((until) => until && until > now)
        .sort((a, b) => b - a)[0] || null;

      setAbusiveRestrictionUntil(activeRestriction);
      return activeRestriction;
    } catch (error) {
      console.error("ERRO AO VERIFICAR RESTRIÇÃO DE ABORDAGEM ABUSIVA:", error);
      setAbusiveRestrictionUntil(null);
      return null;
    } finally {
      setAbusiveRestrictionLoading(false);
    }
  }

  function getAbusiveRestrictionMessage(until = abusiveRestrictionUntil) {
    if (!until) return "";

    const remainingMs = Math.max(0, until - Date.now());
    if (!remainingMs) return "";

    const totalMinutes = Math.ceil(remainingMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `Sua conta está com uma restrição temporária de abordagem. Tente novamente em ${hours}h${minutes ? ` ${minutes}min` : ""}.`;
    }

    return `Sua conta está com uma restrição temporária de abordagem. Tente novamente em ${Math.max(1, minutes)} min.`;
  }

  useEffect(() => {
    if (!currentUserId) {
      setAbusiveRestrictionUntil(null);
      return;
    }

    loadAbusiveApproachRestriction(currentUserId);

    const interval = window.setInterval(() => {
      loadAbusiveApproachRestriction(currentUserId);
    }, 60000);

    return () => window.clearInterval(interval);
  }, [currentUserId]);

  async function handleChat(profile, origin = "inside") {
    if (!profile?.id) return;

    const restrictionUntil = await loadAbusiveApproachRestriction(currentUserId);
    if (restrictionUntil && restrictionUntil > Date.now()) {
      setMessage(getAbusiveRestrictionMessage(restrictionUntil));
      return;
    }

    setMessage("");
    setChatLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado.");

      const firstUserId = user.id < profile.id ? user.id : profile.id;
      const secondUserId = user.id < profile.id ? profile.id : user.id;

      let { data: conversation, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`and(user_one_id.eq.${firstUserId},user_two_id.eq.${secondUserId}),and(user_one_id.eq.${secondUserId},user_two_id.eq.${firstUserId})`)
        .maybeSingle();

      if (error) throw error;

      const relationshipBlocked = await isUserBlocked(profile.id, user.id);

      if (relationshipBlocked && !conversation) {
        setMessage("ESTA CONTA ESTÁ INDISPONÍVEL");
        return;
      }

      let isNewConversation = false;

      if (!conversation) {
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({ user_one_id: firstUserId, user_two_id: secondUserId })
          .select()
          .single();

        if (createError) throw createError;
        conversation = newConversation;
        isNewConversation = true;
      }

      const commonConnections = getCommonConnections(profile);
      const icebreakerConnection = commonConnections[0] || null;

      setChatIcebreaker(
        isNewConversation && icebreakerConnection
          ? { connection: icebreakerConnection, question: getIcebreakerForConnection(icebreakerConnection) }
          : null
      );
      setChatConnection(icebreakerConnection || null);
      setChatFollowUpSuggestion(null);
      setChatDeepSuggestion(null);
      setCurrentUserId(user.id);
      setChatOrigin(origin);
      setChatTarget(profile);
      setChatConversation(conversation);
      setChatBlocked(relationshipBlocked);
      setChatMessages([]);
      setChatRevealedPhotoIds([]);
      setChatRefusalMarkedAt(null);
      setChatRefusalPending(false);
      setDismissedInsistenceWarningMessageIds([]);
      setChatText("");
      setChatReplyToMessage(null);
      setScreen("chat");
    } catch (error) {
      console.error("ERRO AO ABRIR CONVERSA:", error);
      setMessage(error.message || "Não foi possível abrir a conversa.");
    } finally {
      setChatLoading(false);
    }
  }

  async function handleDeleteConversation(conversationId) {
    if (!conversationId) return;

    const confirmed = window.confirm(
      "Excluir esta conversa? Todas as mensagens desta conversa serão apagadas."
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversationId);

      if (error) {
        throw error;
      }

      setConversations((current) =>
        current.filter((conversation) => conversation.id !== conversationId)
      );

      setPinnedConversationIds((currentIds) => {
        const nextIds = currentIds.filter((id) => id !== conversationId);
        try {
          window.localStorage.setItem(
            `moon_pinned_conversations_${currentUserId}`,
            JSON.stringify(nextIds)
          );
        } catch (error) {
          console.error("ERRO AO ATUALIZAR CONVERSAS FIXADAS:", error);
        }
        return nextIds;
      });

      if (chatConversation?.id === conversationId) {
        setChatTarget(null);
        setChatConversation(null);
        setChatBlocked(false);
        setChatMessages([]);
        setChatText("");
        setChatReplyToMessage(null);
      }

      showToast({
        title: "Conversa excluída",
        body: "A conversa foi removida.",
      });
    } catch (error) {
      console.error("ERRO AO EXCLUIR CONVERSA:", error);
      setMessage(
        error.message || "Não foi possível excluir a conversa."
      );
    }
  }

  async function handleDeleteMessageForEveryone(messageId) {
    if (!messageId || !currentUserId) {
      return;
    }

    const confirmed = window.confirm(
      "Excluir esta mensagem para todos?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("messages")
        .update({
          deleted_for_everyone: true,
          content: "Mensagem excluída.",
        })
        .eq("id", messageId)
        .eq("sender_id", currentUserId);

      if (error) {
        throw error;
      }

      setChatMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                deleted_for_everyone: true,
                content: "Mensagem excluída.",
              }
            : message
        )
      );

      showToast({
        title: "Mensagem excluída",
        body: "A mensagem foi excluída para todos.",
      });
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR MENSAGEM PARA TODOS:",
        error
      );

      setMessage(
        error.message ||
        "Não foi possível excluir a mensagem."
      );
    }
  }

  function normalizeModerationText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function messageMayBeOffensive(content) {
    const normalized = normalizeModerationText(content);
    if (!normalized) return false;

    const offensiveTerms = [
      "idiota",
      "idiot",
      "imbecil",
      "burro",
      "burra",
      "otario",
      "otaria",
      "babaca",
      "retardado",
      "retardada",
      "inutil",
      "lixo",
      "nojento",
      "nojenta",
      "vagabundo",
      "vagabunda",
      "viado",
      "bicha",
      "maricas",
      "gayzinho",
      "gayzinha",
      "puta",
      "puto",
      "filho da puta",
      "fdp",
      "vai se foder",
      "vai tomar no cu"
    ];

    return offensiveTerms.some((term) => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`(^|\\s)${escaped}($|\\s)`, "i").test(normalized);
    });
  }

  function messageMayBeThreatening(content) {
    const normalized = normalizeModerationText(content);
    if (!normalized) return false;

    const threatPatterns = [
      "vou te matar",
      "vou matar voce",
      "vou acabar com voce",
      "vou acabar contigo",
      "vou te pegar",
      "vou te machucar",
      "vou te agredir",
      "vou bater em voce",
      "vou bater em ti",
      "vou te encontrar",
      "vou atrás de voce",
      "vou atras de voce",
      "vou expor voce",
      "vou expor voce para todo mundo",
      "vou divulgar suas fotos",
      "vou divulgar suas fotos intimas",
      "vou postar suas fotos",
      "vou postar suas fotos intimas",
      "vou vazar suas fotos",
      "vou vazar suas fotos intimas",
      "vou divulgar seu video",
      "vou divulgar seu vídeo",
      "vou vazar seu video",
      "vou vazar seu vídeo",
      "se voce nao fizer",
      "se você não fizer",
      "se voce nao me mandar",
      "se você não me mandar",
      "vou contar para todo mundo",
      "vou contar pra todo mundo",
      "vou mostrar para todo mundo",
      "vou mostrar pra todo mundo",
      "vou publicar suas fotos",
      "vou publicar seu video"
    ];

    return threatPatterns.some((term) => normalized.includes(normalizeModerationText(term)));
  }

  function dismissThreatMessageWarning(messageId) {
    if (!messageId) return;
    setDismissedThreatMessageIds((current) =>
      current.includes(messageId) ? current : [...current, messageId]
    );
  }

  function selectChatMessageForReply(chatMessage) {
    if (!chatMessage?.id) return;
    if (chatMessage.deleted_for_everyone) return;

    setChatReplyToMessage(chatMessage);
  }

  function cancelChatReply() {
    setChatReplyToMessage(null);
  }

  async function ensureChatInteractionAllowed() {
    if (!chatTarget?.id || !currentUserId) return false;

    const blocked = await isUserBlocked(chatTarget.id, currentUserId);
    if (blocked) {
      setChatBlocked(true);
      setMessage("ESTA CONTA ESTÁ INDISPONÍVEL");
      return false;
    }

    setChatBlocked(false);
    return true;
  }

  async function sendChatTextMessage(content) {
    if (!content || !chatConversation?.id) return;
    if (!(await ensureChatInteractionAllowed())) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      const restrictionUntil = await loadAbusiveApproachRestriction(user.id);
      if (restrictionUntil && restrictionUntil > Date.now()) {
        setMessage(getAbusiveRestrictionMessage(restrictionUntil));
        return;
      }

      const { data: insertedMessage, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatConversation.id,
          sender_id: user.id,
          content,
          message_type: "text",
          reply_to_message_id: chatReplyToMessage?.id || null,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setChatMessages((currentMessages) => {
        if (!insertedMessage || currentMessages.some((message) => message.id === insertedMessage.id)) {
          return currentMessages;
        }
        return [...currentMessages, insertedMessage];
      });

      setChatIcebreaker(null);
      setChatFollowUpSuggestion(null);
      setChatDeepSuggestion(null);
      setChatText("");
      setChatReplyToMessage(null);
      if (chatRefusalPending) {
        setChatRefusalMarkedAt(insertedMessage?.created_at || new Date().toISOString());
        setChatRefusalPending(false);
        setDismissedInsistenceWarningMessageIds([]);
      }
      setOffensiveWarning(false);
      setOffensivePendingContent("");
      showToast({
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

  async function handleSendMessage(event) {
    event.preventDefault();

    const content = chatText.trim();

    if (!content || !chatConversation?.id) {
      return;
    }

    if (messageMayBeThreatening(content)) {
      setThreatPendingContent(content);
      setThreatWarning(true);
      return;
    }

    if (messageMayBeOffensive(content)) {
      setOffensivePendingContent(content);
      setOffensiveWarning(true);
      return;
    }

    await sendChatTextMessage(content);
  }

  async function handleSendOffensiveMessage() {
    const content = offensivePendingContent.trim();
    if (!content) {
      setOffensiveWarning(false);
      return;
    }

    await sendChatTextMessage(content);
  }

  function cancelThreatMessage() {
    setThreatWarning(false);
    setThreatPendingContent("");
    setChatText("");
  }

  useEffect(() => {
    setDismissedOffensiveMessageIds([]);
    setDismissedThreatMessageIds([]);
  }, [chatConversation?.id]);

  useEffect(() => {
    setDismissedIntimateMessageIds([]);
    setChatRevealedPhotoIds([]);
  }, [chatConversation?.id]);

  function dismissOffensiveMessageWarning(messageId) {
    if (!messageId) return;
    setDismissedOffensiveMessageIds((current) =>
      current.includes(messageId) ? current : [...current, messageId]
    );
  }

  function dismissInsistenceWarning(messageId) {
    if (!messageId) return;
    setDismissedInsistenceWarningMessageIds((current) =>
      current.includes(messageId) ? current : [...current, messageId]
    );
  }

  function markChatRefusal() {
    const refusalMessage = "Obrigado, mas não tenho interesse em continuar a conversa.";
    setChatText(refusalMessage);
    setChatRefusalPending(true);
  }

  function openContextualOffensiveReport(messageId) {
    setReportTarget(chatTarget || null);
    setReportReason("");
    setReportDescription(
      messageId
        ? `Denúncia contextual relacionada à mensagem ${messageId}.`
        : "Denúncia contextual relacionada a uma mensagem recebida."
    );
  }

  function openChatMediaPicker(mode) {
    if (abusiveRestrictionUntil && abusiveRestrictionUntil > Date.now()) {
      setMessage(getAbusiveRestrictionMessage());
      return;
    }

    setShowChatAttachMenu(false);
    setChatMediaMode(mode);

    if (mode === "video") {
      chatVideoInputRef.current?.click();
      return;
    }

    if (mode === "gallery") {
      chatGalleryInputRef.current?.click();
      return;
    }

    chatMediaInputRef.current?.click();
  }

  async function handleChatMediaChange(event) {
    const file = event.target.files?.[0];
    const mode = chatMediaMode;

    if (!file || !chatConversation?.id || !currentUserId) {
      event.target.value = "";
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setMessage("Escolha uma foto ou vídeo.");
      event.target.value = "";
      return;
    }

    if (mode === "camera" && !isImage) {
      setMessage("A câmera rápida aceita fotos.");
      event.target.value = "";
      return;
    }

    if (mode === "video" && !isVideo) {
      setMessage("Escolha um vídeo para enviar.");
      event.target.value = "";
      return;
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024;

    if (file.size > maxSize) {
      setMessage(
        isVideo
          ? "O vídeo deve ter no máximo 50 MB."
          : "A foto deve ter no máximo 15 MB."
      );
      event.target.value = "";
      return;
    }

    if (!(await ensureChatInteractionAllowed())) {
      event.target.value = "";
      return;
    }

    setChatMediaLoading(true);
    setMessage("");

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() ||
        (isVideo ? "mp4" : "jpg");
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${currentUserId}/${chatConversation.id}/${fileName}`;
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: insertedMessage, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatConversation.id,
          sender_id: currentUserId,
          content: file.name,
          message_type: isVideo ? "video" : "image",
          media_url: filePath,
          media_expires_at: expiresAt,
          is_intimate: chatMediaIntimate,
        })
        .select("*")
        .single();

      if (error) {
        await supabase.storage.from("chat-media").remove([filePath]);
        throw error;
      }

      const [hydratedMessage] = await hydrateChatMessages([insertedMessage]);

      setChatMessages((currentMessages) => {
        if (!hydratedMessage || currentMessages.some((item) => item.id === hydratedMessage.id)) {
          return currentMessages;
        }
        return [...currentMessages, hydratedMessage];
      });

      showToast({
        title: isVideo ? "Vídeo enviado" : "Foto enviada",
        body: "Esta mídia ficará disponível por 10 minutos.",
      });
    } catch (error) {
      console.error("ERRO AO ENVIAR MÍDIA DA CONVERSA:", error);
      setMessage(
        error.message ||
        "Não foi possível enviar a mídia."
      );
    } finally {
      setChatMediaLoading(false);
      setChatMediaMode(null);
      setChatMediaIntimate(false);
      event.target.value = "";
    }
  }

  async function handleSendLocation() {
    if (!chatConversation?.id || !currentUserId) return;

    setShowChatAttachMenu(false);
    setMessage("");

    if (!(await ensureChatInteractionAllowed())) {
      return;
    }

    if (!navigator.geolocation) {
      setMessage("Seu dispositivo não oferece localização pelo navegador.");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      const { data: insertedMessage, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: chatConversation.id,
          sender_id: currentUserId,
          content: "Localização compartilhada",
          message_type: "location",
          latitude,
          longitude,
        })
        .select("*")
        .single();

      if (error) throw error;

      setChatMessages((currentMessages) => {
        if (!insertedMessage || currentMessages.some((item) => item.id === insertedMessage.id)) {
          return currentMessages;
        }
        return [...currentMessages, insertedMessage];
      });

      showToast({
        title: "Localização enviada",
        body: "Sua localização atual foi compartilhada na conversa.",
      });
    } catch (error) {
      console.error("ERRO AO ENVIAR LOCALIZAÇÃO:", error);
      const code = error?.code;
      setMessage(
        code === 1
          ? "Permissão de localização negada."
          : code === 2
            ? "Não foi possível encontrar sua localização."
            : code === 3
              ? "A localização demorou demais para responder."
              : error.message || "Não foi possível enviar a localização."
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
        "Foto adicionada com sucesso!"
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
        "Foto principal atualizada!"
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

    const normalizedName = form.name.trim();

    if (!normalizedName) {
      setMessage("Informe seu nome.");
      return;
    }

    if (normalizedName.length > 8) {
      setMessage("O nome pode ter no máximo 8 caracteres.");
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
            name: form.name.trim(),
            birth_date:
              form.birthDate,
          });

      if (profileError) {
        throw profileError;
      }

      setMessage("");
      setScreen("verification");

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

    const normalizedName = profileDisplayName.trim();
    const nameChanged = normalizedName !== profileOriginalName.trim();
    if (!normalizedName) {
      setMessage("Informe seu nome.");
      return;
    }

    if (normalizedName.length > 6) {
      setMessage("O nome pode ter no máximo 8 caracteres.");
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
            ...(profileDisplayName.trim() !== profileOriginalName.trim()
              ? { name: profileDisplayName.trim() }
              : {}),
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
            profession:
              profileForm.profession,
            education:
              profileForm.education,
            intention:
              profileForm.intention,
            habits:
              profileForm.habits,
            hobbies:
              profileForm.hobbies,
            personality:
              profileForm.personality,
            relationship:
              profileForm.relationship,
            interests:
              profileForm.interests,
            languages:
              profileForm.languages,
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

      if (profileDisplayName.trim() !== profileOriginalName.trim()) {
        const changedAt = new Date().toISOString();
        setProfileOriginalName(profileDisplayName.trim());
        setProfileNameChangedAt(changedAt);
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

  const filteredMapProfiles = mapProfiles.filter((profile) => {
    const age = calculateAge(profile.birth_date);
    const matchesAge = age >= minAge && age <= maxAge;
    const matchesIdentity = !identityFilter || profile.gender === identityFilter;
    const matchesSexuality = !sexualityFilter || profile.sexuality === sexualityFilter;
    const matchesPosition = !positionFilter || profile.position === positionFilter;
    const matchesAvailability = !availabilityFilter || profile.availability === availabilityFilter;
    return matchesAge && matchesIdentity && matchesSexuality && matchesPosition && matchesAvailability;
  });

const filteredConversations = conversations
        .map((conversation) => ({
          ...conversation,
          distanceKm: getConversationDistance(conversation.profile),
        }))
        .filter((conversation) => {
          if (conversationFilter === "unread") {
            return conversation.unreadCount > 0;
          }

          if (conversationFilter === "online") {
            const status = getOnlineStatus(
              conversation.profile?.last_active_at
            );
            return status === "ATIVO AGORA";
          }

          return true;
        })
        .sort((a, b) => {
          const aPinned = pinnedConversationIds.includes(a.id);
          const bPinned = pinnedConversationIds.includes(b.id);

          if (aPinned !== bPinned) {
            return aPinned ? -1 : 1;
          }

          if (conversationFilter === "distance") {
            const aDistance =
              a.distanceKm === null ? Number.POSITIVE_INFINITY : a.distanceKm;
            const bDistance =
              b.distanceKm === null ? Number.POSITIVE_INFINITY : b.distanceKm;
            return aDistance - bDistance;
          }

          return 0;
        });

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

  {showIosInstallGuide && (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="moon-ios-install-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.82)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={() => setShowIosInstallGuide(false)}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "390px",
          maxHeight: "calc(100vh - 40px)",
          overflowY: "auto",
          border: "1px solid #292929",
          background: "#0b0b0b",
          padding: "28px 22px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#c9b58a",
            fontSize: "9px",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          MOON
        </div>

        <h2
          id="moon-ios-install-title"
          style={{
            margin: "0 0 10px",
            textAlign: "center",
            color: "#f4ead7",
            fontSize: "19px",
            fontWeight: 400,
            letterSpacing: "0.6px",
          }}
        >
          ADICIONE A MOON AO CELULAR
        </h2>

        <p
          style={{
            margin: "0 0 24px",
            textAlign: "center",
            color: "#77736b",
            fontSize: "10px",
            lineHeight: "1.6",
          }}
        >
          No iPhone, a instalação é feita pelo menu Compartilhar do Safari.
        </p>

        <div
          style={{
            borderTop: "1px solid #242424",
            borderBottom: "1px solid #242424",
            padding: "18px 0",
          }}
        >
          {[
            ["01", "Abra a MOON no Safari."],
            ["02", "Toque no botão Compartilhar do navegador."],
            ["03", "Role o menu e toque em “Adicionar à Tela de Início”."],
            ["04", "Confirme tocando em “Adicionar”."],
          ].map(([number, text]) => (
            <div
              key={number}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: number === "04" ? 0 : "16px",
              }}
            >
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  border: "1px solid #c9b58a",
                  color: "#c9b58a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8px",
                  letterSpacing: "0.5px",
                  flexShrink: 0,
                }}
              >
                {number}
              </div>

              <div
                style={{
                  color: "#aaa59b",
                  fontSize: "10px",
                  lineHeight: "1.55",
                  paddingTop: "3px",
                }}
              >
                {text}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowIosInstallGuide(false)}
          style={{
            width: "100%",
            height: "44px",
            marginTop: "20px",
            border: "1px solid #c9b58a",
            background: "#15130f",
            color: "#c9b58a",
            fontSize: "9px",
            letterSpacing: "1.6px",
            cursor: "pointer",
          }}
        >
          ENTENDI
        </button>
      </div>
    </div>
  )}
  return (
    <main className="moon-app">
      {captureShieldActive && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483647,
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f4ead7",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            pointerEvents: "all",
          }}
        >
          MOON • CONTEÚDO PROTEGIDO
        </div>
      )}

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

      {matchTarget && (
        <>
          <style>{`
            @keyframes moonMatchBackdrop {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes moonMatchCard {
              0% { opacity: 0; transform: translateY(24px) scale(0.96); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes moonMatchPhotoLeft {
              0% { opacity: 0; transform: translateX(-24px) rotate(-6deg); }
              100% { opacity: 1; transform: translateX(0) rotate(-6deg); }
            }
            @keyframes moonMatchPhotoRight {
              0% { opacity: 0; transform: translateX(24px) rotate(6deg); }
              100% { opacity: 1; transform: translateX(0) rotate(6deg); }
            }
            @media (max-width: 600px) {
              .moon-match-overlay { padding: 20px; }
              .moon-match-card { width: min(100%, 360px) !important; padding: 30px 20px !important; }
              .moon-match-photos { height: 230px !important; }
              .moon-match-photo { width: 150px !important; height: 205px !important; }
            }
          `}</style>

          <div
            className="moon-match-overlay"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px",
              background: "rgba(0, 0, 0, 0.88)",
              backdropFilter: "blur(12px)",
              animation: "moonMatchBackdrop 0.35s ease-out",
            }}
          >
            <div
              className="moon-match-card"
              style={{
                width: "min(100%, 430px)",
                padding: "38px 30px 30px",
                border: "1px solid #2a2a2a",
                background: "#090909",
                textAlign: "center",
                boxSizing: "border-box",
                animation: "moonMatchCard 0.45s cubic-bezier(.2,.8,.2,1)",
              }}
            >
              <div
                style={{
                  color: "#c9b58a",
                  fontSize: "9px",
                  letterSpacing: "3px",
                  marginBottom: "14px",
                }}
              >
                MOON
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#f4ead7",
                  fontSize: "25px",
                  fontWeight: 400,
                  letterSpacing: "1px",
                }}
              >
                VOCÊS SE CONECTARAM
              </h2>

              <p
                style={{
                  margin: "10px 0 26px",
                  color: "#8d887e",
                  fontSize: "11px",
                  lineHeight: 1.6,
                }}
              >
                Agora vocês podem começar uma conversa.
              </p>

              <div
                className="moon-match-photos"
                style={{
                  position: "relative",
                  height: "270px",
                  margin: "0 auto 30px",
                  maxWidth: "340px",
                }}
              >
                <div
                  className="moon-match-photo"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "24px",
                    width: "175px",
                    height: "235px",
                    overflow: "hidden",
                    border: "2px solid #171717",
                    background: "#111",
                    transform: "rotate(-6deg)",
                    animation: "moonMatchPhotoLeft 0.55s 0.12s both cubic-bezier(.2,.8,.2,1)",
                    zIndex: 1,
                  }}
                >
                  {matchTarget.ownPhoto ? (
                    <img
                      src={matchTarget.ownPhoto}
                      alt="Sua foto"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "9px", letterSpacing: "1px" }}>
                      SUA FOTO
                    </div>
                  )}
                </div>

                <div
                  className="moon-match-photo"
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "10px",
                    width: "175px",
                    height: "235px",
                    overflow: "hidden",
                    border: "2px solid #c9b58a",
                    background: "#111",
                    transform: "rotate(6deg)",
                    animation: "moonMatchPhotoRight 0.55s 0.18s both cubic-bezier(.2,.8,.2,1)",
                    zIndex: 2,
                  }}
                >
                  {matchTarget.targetPhoto ? (
                    <img
                      src={matchTarget.targetPhoto}
                      alt={matchTarget.profile?.name || "Perfil"}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "9px", letterSpacing: "1px" }}>
                      FOTO
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  color: "#f4ead7",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  marginBottom: "22px",
                }}
              >
                {matchTarget.profile?.name || "Nova conexão"}
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                <button
                  type="button"
                  onClick={async () => {
                    const profile = matchTarget.profile;
                    setMatchTarget(null);
                    if (profile?.id) {
                      await handleChat(profile, "inside");
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "46px",
                    border: "1px solid #c9b58a",
                    background: "#c9b58a",
                    color: "#090909",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "1.2px",
                    cursor: "pointer",
                  }}
                >
                  ENVIAR MENSAGEM
                </button>

                <button
                  type="button"
                  onClick={() => setMatchTarget(null)}
                  style={{
                    width: "100%",
                    height: "44px",
                    border: "1px solid #333",
                    background: "transparent",
                    color: "#c9b58a",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "1.2px",
                    cursor: "pointer",
                  }}
                >
                  AGORA NÃO
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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

            <div style={{ marginBottom: "18px" }}>
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
                maxLength={8}
                required
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "7px",
                  padding: "0 2px",
                }}
              >
                <span
                  style={{
                    color: "#77736b",
                    fontSize: "9px",
                    letterSpacing: "0.2px",
                  }}
                >
                  Seu nome pode ter no máximo 8 caracteres.
                </span>
                <span
                  style={{
                    color: form.name.length >= 8 ? "#c9b58a" : "#77736b",
                    fontSize: "9px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {form.name.length}/8
                </span>
              </div>
            </div>

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


        </section>
      )}

      {/* VERIFICAÇÃO DE PERFIL */}

      {screen === "verification" && (
        <section className="form-screen">
          <div className="moon-logo">
            MOON
          </div>

          <h1>
            Verifique seu perfil
          </h1>

          <p className="form-subtitle">
            Para manter a MOON mais segura, precisamos confirmar que existe uma pessoa real por trás desta conta.
          </p>

          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              margin: "25px auto 0",
              padding: "25px",
              border: "1px solid #292929",
              borderRadius: "2px",
              textAlign: "center",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: "#c9b58a",
                fontSize: "12px",
                letterSpacing: "2px",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              VERIFICAÇÃO MOON
            </div>

            <p
              className="form-subtitle"
              style={{
                marginTop: "0",
                marginBottom: "0",
              }}
            >
              Na próxima etapa, sua câmera será usada para realizar uma verificação facial diretamente no navegador.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setScreen("verificationCamera");
            }}
            style={{
              marginTop: "25px",
            }}
          >
            COMEÇAR VERIFICAÇÃO
          </button>

          {message && (
            <p className="form-subtitle">
              {message}
            </p>
          )}
        </section>
      )}

      {/* ESTRUTURA DA CÂMERA DE VERIFICAÇÃO */}

      {screen === "verificationCamera" && (
        <section className="form-screen">
          <div className="moon-logo">
            MOON
          </div>

          <h1>
            Verificação
          </h1>

          <p className="form-subtitle">
            {verificationCameraLoading
              ? "Solicitando acesso à câmera..."
              : verificationLivenessPassed
                ? "Verificação concluída. Você pode continuar."
                : verificationFaceDetected
                  ? "Rosto detectado. Pisque uma vez para continuar."
                  : "Posicione seu rosto no centro da câmera."}
          </p>

          <div
            style={{
              width: "100%",
              maxWidth: "430px",
              aspectRatio: "4 / 5",
              margin: "25px auto 0",
              border: "1px solid #292929",
              borderRadius: "2px",
              overflow: "hidden",
              background: "#090909",
              position: "relative",
            }}
          >
            <video
              ref={verificationVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              fontSize: "12px",
              letterSpacing: "0.08em",
              fontWeight: 600,
              color: verificationFaceDetected ? "#f4ead7" : "#777777",
              textAlign: "center",
            }}
          >
            {verificationLivenessPassed
              ? "VERIFICAÇÃO CONCLUÍDA"
              : verificationFaceDetected
                ? "PIQUE UMA VEZ"
                : "AGUARDANDO ROSTO"}
          </div>

          <button
            type="button"
            disabled={!verificationLivenessPassed}
            onClick={async () => {
              const { data: { user: currentUser }, error: userError } =
                await supabase.auth.getUser();

              if (userError || !currentUser?.id) {
                setMessage("Não foi possível concluir a verificação.");
                return;
              }

              const { error: verificationError } = await supabase
                .from("profiles")
                .update({ is_verified: true })
                .eq("id", currentUser.id);

              if (verificationError) {
                console.error("ERRO AO SALVAR VERIFICAÇÃO:", verificationError);
                setMessage("Não foi possível salvar sua verificação. Tente novamente.");
                return;
              }

              setMessage("Perfil verificado com sucesso.");
              setScreen("profile");
            }}
            style={{
              marginTop: "22px",
              opacity: verificationLivenessPassed ? 1 : 0.45,
            }}
          >
            CONTINUAR
          </button>

          {message && (
            <p
              className="form-subtitle"
              style={{
                marginTop: "18px",
              }}
            >
              {message}
            </p>
          )}
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


        </section>
      )}

      {/* REDEFINIR SENHA */}

      {screen === "resetPassword" && (
        <section className="form-screen">

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
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            width: "100vw",
            height: "100vh",
            overflowY: "auto",
            boxSizing: "border-box",
            background: "#050505",
            display: "flex",
            justifyContent: "center",
            padding: "24px 16px 60px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              minHeight: "100%",
              boxSizing: "border-box",
            }}
          >

          <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
            <button
              className="back-button"
              type="button"
              onClick={() => { setLegalPage(null); setMessage(""); }}
            >
              VOLTAR
            </button>
          </div>

          <div style={{ textAlign: "center", marginBottom: "34px" }}>
            <div className="moon-logo">MOON</div>
            <p className="moon-tagline">FIND YOUR NIGHT.</p>
          </div>

          <style>{`
            .legal-document { color: #aaa59b; font-size: 11px; line-height: 1.85; }
            .legal-document p { margin: 0 0 16px; }
            .legal-document h2 { color: #d6b97d; font-size: 10px; font-weight: 500; letter-spacing: 1.4px; margin: 28px 0 10px; }
            .legal-document strong { color: #d8d0c1; font-weight: 500; }
            @media (max-width: 600px) {
              .legal-document { font-size: 10px; line-height: 1.8; }
              .legal-document h2 { font-size: 9px; margin-top: 24px; }
            }
            .back-button {
              border: 1px solid #c9b58a !important;
              color: #c9b58a !important;
            }
          `}</style>

          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "1px solid #242424",
              background: "#0b0b0b",
              padding: "clamp(20px, 4vw, 32px)",
            }}
          >
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

          <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
            <button
              className="back-button"
              type="button"
              onClick={() => { setLegalPage(null); setMessage(""); }}
            >
              VOLTAR
            </button>
          </div>
        </div>
        </section>
      )}

      {screen === "support" && (
        <main className="moon-page" onLoad={loadUserSupportTickets}>
          <section className="moon-panel" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
              <div>
                <div className="moon-eyebrow">MOON</div>
                <h1>Suporte</h1>
                <p>Estamos aqui para ajudar.</p>
              </div>

              <button
                type="button"
                onClick={() => { setScreen("settings"); setMessage(""); }}
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

            <form onSubmit={handleSubmitSupportTicket} style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px" }}>
                <span style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.6px" }}>
                  CATEGORIA
                </span>
                <select
                  value={supportForm.category}
                  onChange={(event) =>
                    setSupportForm((current) => ({
                      ...current,
                      category: event.target.value,
                    }))
                  }
                  disabled={supportSubmitting}
                  style={{
                    width: "100%",
                    minHeight: "48px",
                    padding: "0 14px",
                    border: "1px solid #242424",
                    borderRadius: "10px",
                    background: "#090909",
                    color: "#f4ead7",
                    fontSize: "12px",
                    outline: "none",
                  }}
                >
                  <option value="account">Problema com minha conta</option>
                  <option value="app">Problema no aplicativo</option>
                  <option value="security">Segurança</option>
                  <option value="report">Denúncia</option>
                  <option value="privacy">Privacidade</option>
                  <option value="question">Dúvida</option>
                  <option value="other">Outro assunto</option>
                </select>
              </label>

              <label style={{ display: "grid", gap: "8px" }}>
                <span style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.6px" }}>
                  ASSUNTO
                </span>
                <input
                  type="text"
                  value={supportForm.subject}
                  onChange={(event) =>
                    setSupportForm((current) => ({
                      ...current,
                      subject: event.target.value.slice(0, 120),
                    }))
                  }
                  maxLength={120}
                  placeholder="Ex.: Não consigo entrar na minha conta"
                  disabled={supportSubmitting}
                  style={{
                    width: "100%",
                    minHeight: "48px",
                    padding: "0 14px",
                    border: "1px solid #242424",
                    borderRadius: "10px",
                    background: "#090909",
                    color: "#f4ead7",
                    fontSize: "12px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", color: "#55524d", fontSize: "9px", letterSpacing: "0.8px" }}>
                  {supportForm.subject.length}/120
                </div>
              </label>

              <label style={{ display: "grid", gap: "8px" }}>
                <span style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.6px" }}>
                  DESCRIÇÃO
                </span>
                <textarea
                  value={supportForm.description}
                  onChange={(event) =>
                    setSupportForm((current) => ({
                      ...current,
                      description: event.target.value.slice(0, 3000),
                    }))
                  }
                  maxLength={3000}
                  rows={8}
                  placeholder="Descreva sua dúvida ou o problema com o máximo de detalhes possível."
                  disabled={supportSubmitting}
                  style={{
                    width: "100%",
                    padding: "14px",
                    border: "1px solid #242424",
                    borderRadius: "10px",
                    background: "#090909",
                    color: "#f4ead7",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", color: "#55524d", fontSize: "9px", letterSpacing: "0.8px" }}>
                  {supportForm.description.length}/3000
                </div>
              </label>

              <div style={{ marginTop: "4px", padding: "14px", border: "1px solid #242424", background: "#090909", color: "#77736b", fontSize: "10px", lineHeight: "1.6" }}>
                Envie apenas informações necessárias para que nossa equipe consiga entender e resolver sua solicitação.
              </div>

              <button
                type="submit"
                disabled={supportSubmitting}
                style={{
                  width: "100%",
                  minHeight: "50px",
                  border: "1px solid #c9b58a",
                  borderRadius: "10px",
                  background: "#15130f",
                  color: "#c9b58a",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "1.6px",
                  cursor: supportSubmitting ? "default" : "pointer",
                  opacity: supportSubmitting ? 0.6 : 1,
                }}
              >
                {supportSubmitting ? "ENVIANDO..." : "ENVIAR CHAMADO"}
              </button>
            </form>

            <div style={{ marginTop: "34px", paddingTop: "26px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#d6b97d", fontSize: "9px", letterSpacing: ".16em" }}>MEUS CHAMADOS</div>
                  <div style={{ color: "#77736c", fontSize: "10px", marginTop: "5px" }}>Acompanhe suas solicitações e respostas da equipe.</div>
                </div>
                <button
                  type="button"
                  onClick={loadUserSupportTickets}
                  disabled={userSupportLoading}
                  style={{
                    padding: "9px 13px",
                    borderRadius: "999px",
                    border: "1px solid rgba(214,185,125,.25)",
                    background: "transparent",
                    color: "#d6b97d",
                    fontSize: "9px",
                    letterSpacing: ".12em",
                    cursor: userSupportLoading ? "default" : "pointer",
                    opacity: userSupportLoading ? .6 : 1,
                  }}
                >
                  {userSupportLoading ? "ATUALIZANDO..." : "ATUALIZAR"}
                </button>
              </div>

              {userSupportLoading && userSupportTickets.length === 0 ? (
                <div style={{ color: "#77736c", fontSize: "10px", padding: "18px 0" }}>Carregando seus chamados...</div>
              ) : userSupportTickets.length === 0 ? (
                <div style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: "12px", padding: "22px", color: "#77736c", fontSize: "10px", lineHeight: "1.6" }}>
                  Você ainda não abriu nenhum chamado.
                </div>
              ) : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {userSupportTickets.map((ticket) => {
                    const statusLabel = ticket.status === "open"
                      ? "ABERTO"
                      : ticket.status === "in_progress"
                        ? "EM ANÁLISE"
                        : ticket.status === "answered"
                          ? "RESPONDIDO"
                          : "RESOLVIDO";

                    const categoryLabel = {
                      account: "CONTA", app: "APLICATIVO", security: "SEGURANÇA", report: "DENÚNCIA",
                      privacy: "PRIVACIDADE", question: "DÚVIDA", other: "OUTRO",
                    }[ticket.category] || "OUTRO";

                    return (
                      <article key={ticket.id} style={{ border: "1px solid rgba(255,255,255,.09)", borderRadius: "12px", padding: "16px", background: "rgba(255,255,255,.02)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
                          <div>
                            <div style={{ color: "#f4ead7", fontSize: "12px", fontWeight: 600 }}>{ticket.subject}</div>
                            <div style={{ color: "#77736c", fontSize: "9px", marginTop: "6px", letterSpacing: ".08em" }}>
                              {categoryLabel} · {ticket.created_at ? new Date(ticket.created_at).toLocaleString("pt-BR") : ""}
                            </div>
                          </div>
                          <span style={{ padding: "6px 9px", borderRadius: "999px", border: "1px solid rgba(214,185,125,.22)", color: "#d6b97d", fontSize: "8px", letterSpacing: ".12em", whiteSpace: "nowrap" }}>
                            {statusLabel}
                          </span>
                        </div>

                        <div style={{ marginTop: "14px", padding: "12px", background: "#090909", border: "1px solid #202020", color: "#aaa49a", fontSize: "10px", lineHeight: "1.65", whiteSpace: "pre-wrap" }}>
                          {ticket.description}
                        </div>

                        {ticket.admin_response ? (
                          <div style={{ marginTop: "12px", padding: "13px", background: "rgba(214,185,125,.045)", border: "1px solid rgba(214,185,125,.16)" }}>
                            <div style={{ color: "#d6b97d", fontSize: "8px", letterSpacing: ".14em", marginBottom: "7px" }}>RESPOSTA DA EQUIPE</div>
                            <div style={{ color: "#e0d9cd", fontSize: "10px", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>{ticket.admin_response}</div>
                          </div>
                        ) : (
                          <div style={{ marginTop: "10px", color: "#55524d", fontSize: "9px" }}>A equipe ainda não respondeu este chamado.</div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
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
                  {[["USUÁRIOS",adminStats.totalUsers],["ATIVOS",adminStats.activeUsers],["CURTIDAS",adminStats.likes],["CONVERSAS",adminStats.conversations],["MENSAGENS",adminStats.messages],["DENÚNCIAS",adminStats.reports],["SUPORTE",adminStats.support || 0],["BLOQUEIOS",adminStats.blocks]].map(([label,value]) => (
                    <div
                      key={label}
                      onClick={label === "DENÚNCIAS" ? async () => {
                        setScreen("adminReports");
                        await loadAdminReports();
                      } : label === "SUPORTE" ? async () => {
                        await openAdminSupport();
                      } : undefined}
                      style={{
                        border: label === "DENÚNCIAS" || label === "SUPORTE" ? "1px solid rgba(214, 185, 125, .38)" : "1px solid rgba(255,255,255,.12)",
                        borderRadius: "14px",
                        padding: "18px",
                        background: label === "DENÚNCIAS" || label === "SUPORTE" ? "rgba(214, 185, 125, .055)" : "rgba(255,255,255,.035)",
                        cursor: label === "DENÚNCIAS" || label === "SUPORTE" ? "pointer" : "default",
                        transition: "border-color .2s ease, background .2s ease",
                      }}
                    >
                      <div style={{ fontSize: "11px", letterSpacing: ".14em", opacity: .65, marginBottom: "9px" }}>{label}</div>
                      <strong style={{ fontSize: "28px" }}>{value}</strong>
                      {label === "DENÚNCIAS" && <div style={{ marginTop: "8px", color: "#d6b97d", fontSize: "9px", letterSpacing: ".12em" }}>VER DENÚNCIAS →</div>}
                      {label === "SUPORTE" && <div style={{ marginTop: "8px", color: "#d6b97d", fontSize: "9px", letterSpacing: ".12em" }}>VER CHAMADOS →</div>}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "28px", padding: "20px", borderRadius: "16px", border: "1px solid rgba(214,185,125,.18)", background: "rgba(214,185,125,.035)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <div>
                      <div className="moon-eyebrow">ADMINISTRAÇÃO</div>
                      <h2 style={{ margin: "6px 0 4px" }}>🚀 Boost de perfis</h2>
                      <p style={{ margin: 0 }}>Impulsione um perfil manualmente na descoberta.</p>
                    </div>
                    <button type="button" onClick={() => { setScreen("adminBoosts"); loadAdminBoosts(); }} style={{ padding: "10px 16px", borderRadius: "999px", border: "1px solid rgba(214,185,125,.32)", background: "rgba(214,185,125,.07)", color: "#d6b97d", fontSize: "9px", fontWeight: 700, letterSpacing: ".13em", cursor: "pointer" }}>GERENCIAR BOOSTS →</button>
                  </div>
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
                    ↻ ATUALIZAR DADOS
                  </button>
                </div>
              </>
            ) : <p>Nenhum dado disponível.</p>}
          </section>
        </main>
      )}

      {screen === "adminBoosts" && isAdmin && (
        <main className="moon-page">
          <section className="moon-panel" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div><div className="moon-eyebrow">MOON</div><h1>Boost administrativo</h1><p>Conceda boosts para o usuário ativar quando quiser.</p></div>
              <button type="button" onClick={() => setScreen("admin")} style={{ padding: "10px 18px", borderRadius: "999px", border: "1px solid rgba(214,185,125,.28)", background: "transparent", color: "#d6b97d", fontSize: "10px", fontWeight: 600, letterSpacing: ".16em", cursor: "pointer" }}>← VOLTAR</button>
            </div>

            <div style={{ padding: "18px", border: "1px solid rgba(255,255,255,.10)", borderRadius: "14px", background: "rgba(255,255,255,.025)" }}>
              <div style={{ color: "#d6b97d", fontSize: "9px", letterSpacing: ".14em", marginBottom: "10px" }}>CONCEDER BOOST</div>
              <input value={adminBoostSearch} onChange={(event) => searchAdminBoostProfiles(event.target.value)} placeholder="Buscar por nome, e-mail ou ID..." style={{ width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.12)", background: "#0b0b0b", color: "#eee", outline: "none" }} />
              {adminBoostProfiles.length > 0 && (
                <div style={{ marginTop: "8px", display: "grid", gap: "6px" }}>
                  {adminBoostProfiles.map((profile) => (
                    <button key={profile.id} type="button" onClick={() => { setAdminBoostSelectedProfile(profile); setAdminBoostProfiles([]); setAdminBoostSearch(profile.name || ""); }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.08)", background: "#0d0d0d", color: "#eee", cursor: "pointer", textAlign: "left" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1b1b1b", display: "flex", alignItems: "center", justifyContent: "center", color: "#d6b97d", fontSize: "12px" }}>{profile.name?.charAt(0)?.toUpperCase() || "P"}</div>
                      <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}><strong>{profile.name || "Perfil"}</strong><small style={{ color: "#888", fontSize: "9px" }}>{profile.id}</small></span>
                    </button>
                  ))}
                </div>
              )}
              {adminBoostSelectedProfile && <div style={{ marginTop: "10px", color: "#d6b97d", fontSize: "10px" }}>Selecionado: <strong>{adminBoostSelectedProfile.name || "Perfil"}</strong>{` · ${adminBoostSelectedProfile.id}`}</div>}
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "14px" }}>
                <select value={adminBoostDuration} onChange={(event) => setAdminBoostDuration(event.target.value)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,.12)", background: "#0b0b0b", color: "#eee" }}>
                  <option value="1">1 hora</option><option value="3">3 horas</option><option value="5">5 horas</option>
                </select>
                <button type="button" onClick={createAdminBoost} disabled={!adminBoostSelectedProfile || adminBoostSaving} style={{ padding: "12px 18px", borderRadius: "999px", border: "1px solid rgba(214,185,125,.35)", background: "rgba(214,185,125,.09)", color: "#d6b97d", fontSize: "9px", fontWeight: 700, letterSpacing: ".13em", cursor: adminBoostSaving ? "default" : "pointer", opacity: !adminBoostSelectedProfile || adminBoostSaving ? .5 : 1 }}>{adminBoostSaving ? "CONCEDENDO..." : "CONCEDER BOOST"}</button>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}><h2 style={{ margin: 0 }}>Boosts concedidos</h2><button type="button" onClick={loadAdminBoosts} style={{ background: "transparent", border: 0, color: "#d6b97d", cursor: "pointer", fontSize: "10px" }}>↻ ATUALIZAR</button></div>
              {adminBoostLoading ? <p>Carregando boosts...</p> : adminBoosts.length === 0 ? <p>Nenhum boost registrado.</p> : (
                <div style={{ display: "grid", gap: "10px" }}>
                  {adminBoosts.map((boost) => {
                    const activeNow = boost.status === "active" && boost.active && boost.expires_at && new Date(boost.expires_at).getTime() > Date.now();
                    const statusLabel = boost.status === "available"
                      ? "DISPONÍVEL"
                      : activeNow
                        ? "ATIVO"
                        : boost.status === "cancelled"
                          ? "CANCELADO"
                          : "ENCERRADO";
                    const statusColor = boost.status === "available" || activeNow ? "#d6b97d" : "#777";
                    return <article key={boost.id} style={{ padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                        <div>
                          <strong>{boost.profile?.name || boost.user_id}</strong>
                          <div style={{ color: "#777", fontSize: "9px", marginTop: "5px" }}>Duração: {boost.duration_hours || 24}h{boost.status === "available" ? " • Aguardando ativação do usuário" : boost.expires_at ? ` • Até ${new Date(boost.expires_at).toLocaleString("pt-BR")}` : ""}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ color: statusColor, fontSize: "9px", letterSpacing: ".1em" }}>{statusLabel}</span>
                          {(boost.status === "available" || activeNow) && <button type="button" onClick={() => deactivateAdminBoost(boost.id)} style={{ padding: "8px 12px", borderRadius: "999px", border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "#aaa", fontSize: "8px", cursor: "pointer" }}>{boost.status === "available" ? "CANCELAR" : "ENCERRAR"}</button>}
                        </div>
                      </div>
                    </article>;
                  })}
                </div>
              )}
            </div>
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

      {screen === "adminSupport" && isAdmin && (
        <main className="moon-page">
          <section className="moon-panel" style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
              <div>
                <div className="moon-eyebrow">MOON</div>
                <h1>Suporte</h1>
                <p>Atenda as solicitações enviadas pelos usuários.</p>
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

            {adminSupportLoading ? (
              <p>Carregando chamados...</p>
            ) : adminSupportTickets.length === 0 ? (
              <div style={{
                border: "1px solid rgba(255,255,255,.10)",
                borderRadius: "14px",
                padding: "36px 22px",
                textAlign: "center",
                background: "rgba(255,255,255,.025)",
              }}>
                <div style={{ fontSize: "24px", marginBottom: "12px" }}>✓</div>
                <div style={{ color: "#f4ead7", fontSize: "13px", letterSpacing: ".12em" }}>
                  NENHUM CHAMADO
                </div>
                <p style={{ color: "#8a857c", fontSize: "11px", lineHeight: "1.7", margin: "10px 0 0" }}>
                  Não existem solicitações de suporte no momento.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {adminSupportTickets.map((ticket) => {
                  const statusLabel = ticket.status === "open"
                    ? "ABERTO"
                    : ticket.status === "in_progress"
                      ? "EM ANÁLISE"
                      : ticket.status === "answered"
                        ? "RESPONDIDO"
                        : "RESOLVIDO";

                  const categoryLabel = {
                    account: "CONTA",
                    app: "APLICATIVO",
                    security: "SEGURANÇA",
                    report: "DENÚNCIA",
                    privacy: "PRIVACIDADE",
                    question: "DÚVIDA",
                    other: "OUTRO",
                  }[ticket.category] || "OUTRO";

                  const isSelected = adminSupportSelected?.id === ticket.id;

                  return (
                    <article
                      key={ticket.id}
                      style={{
                        border: isSelected ? "1px solid rgba(214, 185, 125, .38)" : "1px solid rgba(255,255,255,.10)",
                        borderRadius: "14px",
                        padding: "18px",
                        background: "rgba(255,255,255,.025)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setAdminSupportSelected(isSelected ? null : ticket);
                          setAdminSupportResponse(ticket.admin_response || "");
                          setMessage("");
                        }}
                        style={{
                          width: "100%",
                          border: "none",
                          background: "transparent",
                          color: "inherit",
                          padding: 0,
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
                          <div>
                            <div style={{ color: "#d6b97d", fontSize: "9px", letterSpacing: ".16em", marginBottom: "7px" }}>
                              CHAMADO #{String(ticket.id).slice(0, 8).toUpperCase()}
                            </div>
                            <div style={{ color: "#f4ead7", fontSize: "13px", fontWeight: 600 }}>
                              {ticket.subject}
                            </div>
                            <div style={{ color: "#8a857c", fontSize: "10px", marginTop: "7px" }}>
                              {ticket.user?.name || "Usuário"} · {categoryLabel} · {ticket.created_at ? new Date(ticket.created_at).toLocaleString("pt-BR") : ""}
                            </div>
                          </div>

                          <span style={{
                            padding: "6px 10px",
                            borderRadius: "999px",
                            border: "1px solid rgba(214, 185, 125, .25)",
                            color: "#d6b97d",
                            fontSize: "9px",
                            letterSpacing: ".12em",
                            whiteSpace: "nowrap",
                          }}>
                            {statusLabel}
                          </span>
                        </div>
                      </button>

                      {isSelected && (
                        <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                          <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".14em", marginBottom: "7px" }}>
                            DESCRIÇÃO
                          </div>
                          <div style={{
                            color: "#d8d2c7",
                            fontSize: "11px",
                            lineHeight: "1.7",
                            whiteSpace: "pre-wrap",
                            padding: "14px",
                            border: "1px solid #242424",
                            background: "#090909",
                          }}>
                            {ticket.description}
                          </div>

                          <div style={{ color: "#77736c", fontSize: "9px", letterSpacing: ".14em", margin: "16px 0 7px" }}>
                            RESPOSTA AO USUÁRIO
                          </div>
                          <textarea
                            value={adminSupportResponse}
                            onChange={(event) => setAdminSupportResponse(event.target.value)}
                            maxLength={3000}
                            rows={6}
                            placeholder="Escreva a resposta para o usuário..."
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              resize: "vertical",
                              padding: "12px",
                              border: "1px solid #292929",
                              background: "#080808",
                              color: "#f4ead7",
                              outline: "none",
                              fontFamily: "inherit",
                              fontSize: "11px",
                              lineHeight: "1.6",
                            }}
                          />

                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
                            <button
                              type="button"
                              disabled={adminSupportActionLoading}
                              onClick={() => handleAdminSupportUpdate(ticket.id, "in_progress")}
                              style={{
                                padding: "10px 15px",
                                borderRadius: "999px",
                                border: "1px solid rgba(214,185,125,.25)",
                                background: "rgba(214,185,125,.05)",
                                color: "#d6b97d",
                                fontSize: "9px",
                                letterSpacing: ".12em",
                                cursor: "pointer",
                              }}
                            >
                              EM ANÁLISE
                            </button>

                            <button
                              type="button"
                              disabled={adminSupportActionLoading}
                              onClick={() => handleAdminSupportUpdate(ticket.id, "answered")}
                              style={{
                                padding: "10px 15px",
                                borderRadius: "999px",
                                border: "1px solid rgba(214,185,125,.35)",
                                background: "rgba(214,185,125,.08)",
                                color: "#d6b97d",
                                fontSize: "9px",
                                fontWeight: 600,
                                letterSpacing: ".12em",
                                cursor: "pointer",
                              }}
                            >
                              {adminSupportActionLoading ? "SALVANDO..." : "RESPONDER"}
                            </button>

                            <button
                              type="button"
                              disabled={adminSupportActionLoading}
                              onClick={() => handleAdminSupportUpdate(ticket.id, "resolved")}
                              style={{
                                padding: "10px 15px",
                                borderRadius: "999px",
                                border: "1px solid rgba(120,180,130,.25)",
                                background: "rgba(120,180,130,.05)",
                                color: "#9bc79f",
                                fontSize: "9px",
                                letterSpacing: ".12em",
                                cursor: "pointer",
                              }}
                            >
                              RESOLVER
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: "22px" }}>
              <button
                type="button"
                onClick={loadAdminSupportTickets}
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
                ↻ ATUALIZAR CHAMADOS
              </button>
            </div>
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
                          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
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
                ↻ ATUALIZAR DENÚNCIAS
              </button>
            </div>
          </section>
        </main>
      )}

      {screen === "myBoosts" && (
        <section
          style={{
            width: "100%",
            maxWidth: "700px",
            minHeight: "100vh",
            padding: "30px 20px 50px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div>
              <div className="moon-eyebrow">MOON</div>
              <h1 style={{ margin: "6px 0 4px" }}>Meus Boosts</h1>
              <p style={{ margin: 0, color: "#8f8b84", fontSize: "12px" }}>Ative quando quiser. O tempo só começa depois da ativação.</p>
            </div>
            <button type="button" onClick={() => setScreen("profile")} style={{ padding: "10px 18px", borderRadius: "999px", border: "1px solid rgba(214,185,125,.28)", background: "transparent", color: "#d6b97d", fontSize: "10px", fontWeight: 600, letterSpacing: ".16em", cursor: "pointer" }}>← VOLTAR</button>
          </div>

          {userActiveBoost && (
            <div style={{ marginBottom: "18px", padding: "22px", borderRadius: "16px", border: "1px solid rgba(214,185,125,.45)", background: "rgba(214,185,125,.07)", textAlign: "center" }}>
              <div style={{ color: "#d6b97d", fontSize: "9px", letterSpacing: ".16em", marginBottom: "10px" }}>BOOST ATIVO</div>
              <div style={{ color: "#f4ead7", fontSize: "34px", letterSpacing: "3px", fontVariantNumeric: "tabular-nums" }}>{formatBoostCountdown(boostSecondsLeft)}</div>
              <div style={{ marginTop: "8px", color: "#aaa59b", fontSize: "11px" }}>Seu perfil está sendo impulsionado na descoberta.</div>
            </div>
          )}

          {message && <p style={{ color: "#c9b58a", fontSize: "11px", textAlign: "center", lineHeight: 1.6 }}>{message}</p>}

          {userBoostsLoading ? (
            <MoonSkeleton rows={3} />
          ) : userBoosts.length === 0 ? (
            <div style={{ padding: "30px 20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.02)", textAlign: "center", color: "#77736b", fontSize: "12px", lineHeight: 1.7 }}>
              Você ainda não recebeu nenhum Boost.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {userBoosts.map((boost) => {
                const isAvailable = boost.status === "available";
                const isActive = boost.status === "active" && boost.active && boost.expires_at && new Date(boost.expires_at).getTime() > Date.now();
                const isUsed = boost.status === "used";
                const isCancelled = boost.status === "cancelled";

                return (
                  <article key={boost.id} style={{ padding: "18px", borderRadius: "14px", border: isAvailable ? "1px solid rgba(214,185,125,.30)" : "1px solid rgba(255,255,255,.08)", background: isAvailable ? "rgba(214,185,125,.045)" : "rgba(255,255,255,.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                      <div>
                        <div style={{ color: isAvailable || isActive ? "#d6b97d" : "#77736b", fontSize: "9px", letterSpacing: ".15em", marginBottom: "7px" }}>
                          {isAvailable ? "DISPONÍVEL" : isActive ? "ATIVO" : isUsed ? "UTILIZADO" : isCancelled ? "CANCELADO" : "ENCERRADO"}
                        </div>
                        <strong style={{ color: "#f4ead7", fontSize: "16px" }}>🚀 Boost de {boost.duration_hours}h</strong>
                        {isActive && boost.expires_at && <div style={{ color: "#77736b", fontSize: "9px", marginTop: "6px" }}>Termina em {new Date(boost.expires_at).toLocaleString("pt-BR")}</div>}
                      </div>

                      {isAvailable && (
                        <button
                          type="button"
                          onClick={() => activateUserBoost(boost.id)}
                          disabled={Boolean(boostActivatingId) || Boolean(userActiveBoost)}
                          style={{ padding: "11px 18px", borderRadius: "999px", border: "1px solid rgba(214,185,125,.42)", background: "rgba(214,185,125,.10)", color: "#d6b97d", fontSize: "9px", fontWeight: 700, letterSpacing: ".13em", cursor: boostActivatingId || userActiveBoost ? "default" : "pointer", opacity: boostActivatingId || userActiveBoost ? .5 : 1 }}
                        >
                          {boostActivatingId === boost.id ? "ATIVANDO..." : "ATIVAR BOOST"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
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

          <div style={{ display: "flex", justifyContent: "center", marginTop: "28px" }}>
            <button
              className="back-button"
              type="button"
              onClick={() => { setScreen("profile"); setMessage(""); }}
            >
              VOLTAR
            </button>
          </div>

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
                        PAINEL ADMINISTRATIVO
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
                        PUBLICIDADE
                      </button>
              </>
            )}

            {(pwaInstallAvailable || pwaIosInstallAvailable) && (
              <div style={{ padding: "18px", borderBottom: "1px solid #242424" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
                  <div>
                    <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "6px" }}>
                      ADICIONAR MOON AO CELULAR
                    </div>
                    <div style={{ color: "#77736b", fontSize: "10px", lineHeight: "1.5" }}>
                      Use a MOON pelo navegador ou adicione o ícone à tela inicial.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleInstallMoon}
                    style={{
                      minWidth: "112px",
                      height: "38px",
                      border: "1px solid #c9b58a",
                      background: "#15130f",
                      color: "#c9b58a",
                      fontSize: "9px",
                      letterSpacing: "1.5px",
                      cursor: "pointer",
                    }}
                  >
                    ADICIONAR
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setSupportForm({
                  category: "question",
                  subject: "",
                  description: "",
                });
                setMessage("");
                setScreen("support");
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
              <span>SUPORTE</span>
              <span style={{ color: "#77736b", fontSize: "14px" }}>›</span>
            </button>

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
                  <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "7px", textAlign: "left" }}>
                    STATUS DE LEITURA
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

            <div style={{ padding: "18px", borderBottom: "1px solid #242424" }}>
              <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "7px", textAlign: "left" }}>
                CONTEÚDO ÍNTIMO
              </div>
              <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.5", marginBottom: "12px", maxWidth: "520px" }}>
                Escolha como o MOON deve lidar com conteúdo íntimo recebido em conversas.
              </div>
              <div style={{ display: "grid", gap: "7px" }}>
                {[
                  ["allow", "QUERO RECEBER", "Conteúdo íntimo recebido pode ser visualizado normalmente."],
                  ["confirm", "PEDIR CONFIRMAÇÃO", "O conteúdo fica oculto até você decidir se quer visualizar."],
                  ["block", "NÃO QUERO RECEBER", "Conteúdo íntimo recebido fica bloqueado."],
                ].map(([value, label, description]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={async () => {
                      const previousValue = intimateContentPreference;
                      setIntimateContentPreference(value);
                      setMessage("");
                      const { data: { user } } = await supabase.auth.getUser();
                      if (!user) return;
                      const { error } = await supabase
                        .from("profiles")
                        .update({ intimate_content_preference: value })
                        .eq("id", user.id);
                      if (error) {
                        setIntimateContentPreference(previousValue);
                        setMessage("Não foi possível atualizar a preferência de conteúdo íntimo.");
                        console.error("ERRO AO ATUALIZAR PREFERÊNCIA DE CONTEÚDO ÍNTIMO:", error);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 13px",
                      border: intimateContentPreference === value ? "1px solid #c9b58a" : "1px solid #292929",
                      background: intimateContentPreference === value ? "#15130f" : "transparent",
                      color: intimateContentPreference === value ? "#c9b58a" : "#77736b",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: "9px", letterSpacing: "1.2px", marginBottom: "5px" }}>{label}</div>
                    <div style={{ fontSize: "8px", lineHeight: "1.5", color: "#66625b" }}>{description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: "18px", borderBottom: "1px solid #242424" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "7px", textAlign: "left" }}>
                    PROTEÇÃO DE FOTOS
                  </div>
                  <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.5", maxWidth: "420px" }}>
                    Fotos recebidas ficam borradas até você decidir se quer visualizar.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextValue = !chatPhotoConfirmationEnabled;
                    setChatPhotoConfirmationEnabled(nextValue);
                    try {
                      if (currentUserId) {
                        window.localStorage.setItem(`moon-chat-photo-confirmation-${currentUserId}`, String(nextValue));
                      }
                    } catch (error) {
                      console.error("ERRO AO SALVAR PROTEÇÃO DE FOTOS:", error);
                    }
                  }}
                  style={{ minWidth: "112px", height: "38px", border: chatPhotoConfirmationEnabled ? "1px solid #c9b58a" : "1px solid #292929", background: chatPhotoConfirmationEnabled ? "#15130f" : "transparent", color: chatPhotoConfirmationEnabled ? "#c9b58a" : "#77736b", fontSize: "9px", letterSpacing: "1.5px", cursor: "pointer" }}
                >
                  {chatPhotoConfirmationEnabled ? "ATIVADO" : "DESATIVADO"}
                </button>
              </div>
            </div>

            <div style={{ padding: "18px", borderBottom: "1px solid #242424" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "18px" }}>
                <div>
                  <div style={{ color: "#f4ead7", fontSize: "10px", letterSpacing: "1.8px", marginBottom: "7px", textAlign: "left" }}>
                    OCULTAR PERFIL
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (!currentUserId) {
                      setMessage("Usuário não encontrado.");
                      return;
                    }

                    const nextValue = !isProfileHidden;
                    const previousValue = isProfileHidden;

                    setIsProfileHidden(nextValue);
                    setMessage("");

                    try {
                      const { data: { user }, error: userError } = await supabase.auth.getUser();

                      if (userError) {
                        throw userError;
                      }

                      if (!user?.id) {
                        throw new Error("Usuário não encontrado.");
                      }

                      const { data: updatedProfile, error } = await supabase
                        .from("profiles")
                        .update({
                          is_hidden: nextValue,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", user.id)
                        .select("id, is_hidden")
                        .single();

                      if (error) {
                        throw error;
                      }

                      if (!updatedProfile || updatedProfile.is_hidden !== nextValue) {
                        throw new Error("Não foi possível confirmar a alteração de visibilidade.");
                      }

                      setIsProfileHidden(updatedProfile.is_hidden === true);

                      if (userLocation.latitude !== null && userLocation.longitude !== null) {
                        await loadNearbyProfiles(
                          userLocation.latitude,
                          userLocation.longitude
                        );
                      }

                      if (screen === "map") {
                        await loadMapProfiles();
                      }

                      setMessage(
                        nextValue
                          ? "Seu perfil está oculto para outros usuários."
                          : "Seu perfil voltou a ficar visível."
                      );
                    } catch (error) {
                      setIsProfileHidden(previousValue);
                      console.error("ERRO AO ATUALIZAR VISIBILIDADE:", error);
                      setMessage(
                        error?.message ||
                        "Não foi possível atualizar a visibilidade do perfil."
                      );
                    }
                  }}
                  style={{
                    minWidth: "112px",
                    height: "38px",
                    border: isProfileHidden ? "1px solid #c9b58a" : "1px solid #292929",
                    background: isProfileHidden ? "#15130f" : "transparent",
                    color: isProfileHidden ? "#c9b58a" : "#77736b",
                    fontSize: "9px",
                    letterSpacing: "1.5px",
                    cursor: "pointer",
                  }}
                >
                  {isProfileHidden ? "OCULTO" : "VISÍVEL"}
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
                <MoonSkeleton rows={2} compact />
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

        </section>
      )}

      {/* MAPA MOON */}

      {screen === "map" && (
        <section style={{ width: "100%", maxWidth: "1000px", minHeight: "100vh", padding: "35px 20px" }}>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "18px",
            }}
          >
            <button
              type="button"
              onClick={() => { setScreen("inside"); setMessage(""); setSelectedMapPoint(null); setMapCenterRequest(null); setSelectedMapProfile(null); }}
              style={{
                border: "none",
                background: "transparent",
                color: "#c9b58a",
                fontSize: "10px",
                letterSpacing: "1.8px",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              ← VOLTAR PARA DESCOBERTA
            </button>
          </div>

          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div className="moon-logo">MOON</div>
            <p className="moon-tagline">FIND YOUR NIGHT.</p>
            <p style={{ color: "#77736b", fontSize: "11px", letterSpacing: "2px", marginTop: "20px" }}>MAPA / DESCUBRIR</p>
          </div>

          {(() => {
            const defaultCenter = [-15.793889, -47.882778];
            const currentCenter = userLocation.latitude !== null && userLocation.longitude !== null
              ? [userLocation.latitude, userLocation.longitude]
              : defaultCenter;
            const mapCenter = mapCenterRequest || currentCenter;

            return (
              <div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
                  <button type="button" onClick={() => setShowMapFilters((current) => !current)} style={{ height: "36px", padding: "0 16px", border: "1px solid #c9b58a", background: showMapFilters ? "#15130f" : "#0b0b0b", color: "#c9b58a", fontSize: "8px", letterSpacing: "1.6px", cursor: "pointer" }}>
                    FILTROS{(identityFilter || sexualityFilter || positionFilter || availabilityFilter || minAge !== 18 || maxAge !== 65) ? " · ATIVOS" : ""}
                  </button>
                </div>
                {showMapFilters && (
                  <div style={{ maxWidth: "760px", margin: "0 auto 14px", padding: "14px", border: "1px solid #292929", background: "#0b0b0b" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                      <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px" }}>IDADE<select value={`${minAge}-${maxAge}`} onChange={(event) => { const [min, max] = event.target.value.split("-").map(Number); setMinAge(min); setMaxAge(max); }} style={{ width: "100%", marginTop: "6px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "10px", outline: "none" }}>
                        <option value="18-65">18 - 65+</option><option value="18-25">18 - 25</option><option value="26-35">26 - 35</option><option value="36-45">36 - 45</option><option value="46-55">46 - 55</option><option value="56-65">56 - 65+</option>
                      </select></label>
                      <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px" }}>IDENTIDADE<select value={identityFilter} onChange={(event) => setIdentityFilter(event.target.value)} style={{ width: "100%", marginTop: "6px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "10px", outline: "none" }}>
                        <option value="">Todas</option><option value="Homem cis">Homem cis</option><option value="Homem trans">Homem trans</option><option value="Não binário">Não binário</option>
                      </select></label>
                      <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px" }}>SEXUALIDADE<select value={sexualityFilter} onChange={(event) => setSexualityFilter(event.target.value)} style={{ width: "100%", marginTop: "6px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "10px", outline: "none" }}>
                        <option value="">Todas</option><option value="Gay">Gay</option><option value="Bissexual">Bissexual</option><option value="Pansexual">Pansexual</option><option value="Outra">Outra</option>
                      </select></label>
                      <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px" }}>POSIÇÃO<select value={positionFilter} onChange={(event) => setPositionFilter(event.target.value)} style={{ width: "100%", marginTop: "6px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "10px", outline: "none" }}>
                        <option value="">Todas</option><option value="Ativo">Ativo</option><option value="Passivo">Passivo</option><option value="Versátil">Versátil</option>
                      </select></label>
                      <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px", gridColumn: "1 / -1" }}>DISPONIBILIDADE<select value={availabilityFilter} onChange={(event) => setAvailabilityFilter(event.target.value)} style={{ width: "100%", marginTop: "6px", background: "#101010", color: "#e9dfcd", border: "1px solid #292929", padding: "10px", outline: "none" }}>
                        <option value="">Todas</option><option value="Agora">Agora</option><option value="Mais tarde">Mais tarde</option><option value="Outro dia">Outro dia</option><option value="Conversar">Conversar</option>
                      </select></label>
                    </div>
                  </div>
                )}

                <div style={{ position: "relative", width: "100%", height: "min(68vh, 620px)", minHeight: "430px", overflow: "hidden", border: "1px solid #292929", background: "#090909" }}>
                <MapContainer center={currentCenter} zoom={12} scrollWheelZoom style={{ width: "100%", height: "100%", background: "#090909" }}>
                  <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler onSelect={(point) => { setSelectedMapPoint(point); setMapCenterRequest([point.latitude, point.longitude]); }} />
                  <MapCenterController center={mapCenterRequest} zoom={14} />

                  {userLocation.latitude !== null && userLocation.longitude !== null && (
                    <>
                      <CircleMarker center={[userLocation.latitude, userLocation.longitude]} radius={13} pathOptions={{ color: "#ffffff", fillColor: "#c9b58a", fillOpacity: 1, weight: 3 }} />
                      <CircleMarker center={[userLocation.latitude, userLocation.longitude]} radius={5} pathOptions={{ color: "#090909", fillColor: "#090909", fillOpacity: 1, weight: 1 }} />
                      <Circle center={[userLocation.latitude, userLocation.longitude]} radius={mapRadius * 1000} pathOptions={{ color: "#c9b58a", fillColor: "#c9b58a", fillOpacity: 0.05, weight: 1 }} />
                    </>
                  )}

                  {filteredMapProfiles.map((profile, index) => {
                    const baseLat = Number(profile.latitude);
                    const baseLng = Number(profile.longitude);
                    const seed = String(profile.id || index).split("").reduce((total, char) => total + char.charCodeAt(0), 0);
                    const offsetLat = (((seed % 17) - 8) * 0.0009);
                    const offsetLng = ((((Math.floor(seed / 17)) % 17) - 8) * 0.0009);

                    return (
                      <CircleMarker
                        key={profile.id}
                        center={[baseLat + offsetLat, baseLng + offsetLng]}
                        radius={11}
                        pathOptions={{ color: "#f4ead7", fillColor: "#c9b58a", fillOpacity: 1, weight: 3 }}
                        eventHandlers={{ click: () => handleMapProfileSelect(profile) }}
                      />
                    );
                  })}

                  {selectedMapPoint && (
                    <>
                      <Circle center={[selectedMapPoint.latitude, selectedMapPoint.longitude]} radius={180} pathOptions={{ color: "#f4ead7", fillColor: "#f4ead7", fillOpacity: 0.08, weight: 2 }} />
                      <CircleMarker center={[selectedMapPoint.latitude, selectedMapPoint.longitude]} radius={15} pathOptions={{ color: "#ffffff", fillColor: "#f4ead7", fillOpacity: 1, weight: 4 }} />
                      <CircleMarker center={[selectedMapPoint.latitude, selectedMapPoint.longitude]} radius={5} pathOptions={{ color: "#090909", fillColor: "#090909", fillOpacity: 1, weight: 1 }} />
                    </>
                  )}
                </MapContainer>

                {selectedMapProfile && (
                  <div style={{ position: "absolute", zIndex: 1200, left: "50%", bottom: "16px", transform: "translateX(-50%)", width: "min(360px, calc(100% - 32px))", padding: "12px", border: "1px solid #c9b58a", background: "rgba(5,5,5,0.97)", display: "flex", alignItems: "center", gap: "12px", boxSizing: "border-box" }}>
                    <div style={{ width: "64px", height: "64px", flexShrink: 0, overflow: "hidden", border: "1px solid #292929", background: "#111" }}>
                      {selectedMapProfile.photoUrl ? (
                        <img src={captureShieldActive ? undefined : selectedMapProfile.photoUrl} alt={selectedMapProfile.name || "Perfil"} {...protectedMediaProps} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#77736b", fontSize: "18px" }}>
                          {selectedMapProfile.name?.charAt(0)?.toUpperCase() || "M"}
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#f4ead7", fontSize: "14px", fontWeight: 600, marginBottom: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {selectedMapProfile.name || "Perfil"}{selectedMapProfile.birth_date ? ` · ${calculateAge(selectedMapProfile.birth_date)} anos` : ""}
                      </div>
                      <div style={{ color: "#c9b58a", fontSize: "9px", letterSpacing: "1px", marginBottom: "8px" }}>
                        {selectedMapProfile.distance_km != null ? `${Number(selectedMapProfile.distance_km).toFixed(1).replace(".", ",")} KM` : "PERFIL PRÓXIMO"}
                      </div>
                      <button type="button" onClick={(event) => { event.stopPropagation(); handleViewMapProfile(selectedMapProfile); }} style={{ height: "30px", padding: "0 12px", border: "1px solid #c9b58a", background: "transparent", color: "#c9b58a", fontSize: "8px", letterSpacing: "1.3px", cursor: "pointer" }}>
                        {selectedMapProfileLoading ? "CARREGANDO..." : "VER PERFIL"}
                      </button>
                    </div>
                    <button type="button" onClick={() => setSelectedMapProfile(null)} aria-label="Fechar" style={{ alignSelf: "flex-start", width: "24px", height: "24px", padding: 0, border: "1px solid #292929", background: "transparent", color: "#77736b", fontSize: "12px", cursor: "pointer" }}>×</button>
                  </div>
                )}

                <div style={{ position: "absolute", zIndex: 1000, top: "16px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", pointerEvents: "none" }}>
                  <span style={{ padding: "9px 11px", border: "1px solid #292929", background: "rgba(5,5,5,0.9)", color: "#77736b", fontSize: "8px", letterSpacing: "1.5px" }}>
                    {selectedMapPoint ? "PONTO SELECIONADO" : "SELECIONE UM PONTO NO MAPA"}
                  </span>
                  <button type="button" onClick={() => {
                    if (userLocation.latitude === null || userLocation.longitude === null) { handleUseLocation(); return; }
                    setMapCenterRequest([userLocation.latitude, userLocation.longitude]);
                  }} style={{ height: "34px", padding: "0 12px", border: "1px solid #c9b58a", background: "rgba(5,5,5,0.92)", color: "#c9b58a", fontSize: "8px", letterSpacing: "1.4px", cursor: "pointer", pointerEvents: "auto" }}>
                    {locationLoading ? "LOCALIZANDO..." : "MINHA LOCALIZAÇÃO"}
                  </button>
                </div>

                {selectedMapPoint && (
                  <div style={{ position: "absolute", zIndex: 1000, top: "64px", left: "16px", padding: "10px 12px", border: "1px solid #292929", background: "rgba(5,5,5,0.92)", color: "#c9b58a", fontSize: "8px", letterSpacing: "1.2px" }}>
                    {selectedMapPoint.latitude.toFixed(5)}, {selectedMapPoint.longitude.toFixed(5)}
                  </div>
                )}

                <div style={{ position: "absolute", zIndex: 1000, left: "16px", bottom: "16px", padding: "13px 14px", border: "1px solid #292929", background: "rgba(5,5,5,0.94)", minWidth: "210px" }}>
                  <div style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.5px", marginBottom: "9px" }}>RAIO DE BUSCA</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input type="range" min="1" max="100" value={mapRadius} onChange={(event) => setMapRadius(Number(event.target.value))} style={{ flex: 1, accentColor: "#c9b58a" }} />
                    <span style={{ color: "#c9b58a", fontSize: "9px", letterSpacing: "1px", minWidth: "40px", textAlign: "right" }}>{mapRadius} KM</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !mapProfilesLoading && setShowMapProfilesPanel((current) => !current)}
                  style={{ position: "absolute", zIndex: 1000, right: "16px", bottom: "16px", padding: "11px 13px", border: "1px solid #c9b58a", background: "rgba(5,5,5,0.96)", color: "#f4ead7", fontSize: "8px", letterSpacing: "1.1px", cursor: mapProfilesLoading ? "default" : "pointer", fontWeight: 600 }}
                >
                  {mapProfilesLoading ? "BUSCANDO PERFIS..." : `${filteredMapProfiles.length} ${filteredMapProfiles.length === 1 ? "PERFIL ENCONTRADO" : "PERFIS ENCONTRADOS"}`}
                </button>

                {showMapProfilesPanel && !mapProfilesLoading && (
                  <div style={{ position: "absolute", zIndex: 1100, right: "16px", bottom: "62px", width: "min(300px, calc(100% - 32px))", maxHeight: "320px", overflowY: "auto", border: "1px solid #c9b58a", background: "rgba(5,5,5,0.98)", padding: "12px", boxSizing: "border-box" }}>
                    <div style={{ color: "#c9b58a", fontSize: "8px", letterSpacing: "1.5px", marginBottom: "10px" }}>PERFIS ENCONTRADOS</div>
                    {filteredMapProfiles.length === 0 ? (
                      <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.6" }}>Nenhum perfil encontrado neste raio.</div>
                    ) : (
                      filteredMapProfiles.map((profile) => (
                        <button
                          key={profile.id}
                          type="button"
                          onClick={(event) => { event.stopPropagation(); handleViewMapProfile(profile); }}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 0", border: 0, borderBottom: "1px solid #202020", background: "transparent", color: "#f4ead7", textAlign: "left", cursor: "pointer" }}
                        >
                          <div style={{ width: "38px", height: "38px", flexShrink: 0, border: "1px solid #c9b58a", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9b58a", fontSize: "13px" }}>
                            {profile.name?.charAt(0)?.toUpperCase() || "M"}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ color: "#f4ead7", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{profile.name || "Perfil"}</div>
                            <div style={{ color: "#c9b58a", fontSize: "8px", letterSpacing: "0.8px", marginTop: "4px" }}>{profile.distance_km != null ? `${Number(profile.distance_km).toFixed(1).replace(".", ",")} KM` : "PERFIL PRÓXIMO"}</div>
                          </div>
                          <span style={{ color: "#c9b58a", fontSize: "9px", letterSpacing: "1px" }}>VER</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              </div>
            );
          })()}


          {message && <p style={{ color: "#c9b58a", fontSize: "10px", textAlign: "center", marginTop: "14px" }}>{message}</p>}
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
                        {profileForm.gender && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>IDENTIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.gender}</span></div>}
                        {profileForm.sexuality && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>SEXUALIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.sexuality}</span></div>}
                        {profileForm.position && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>POSIÇÃO</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.position}</span></div>}
                        {profileForm.availability && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>DISPONIBILIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.availability}</span></div>}
                        {profileForm.profession && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>PROFISSÃO</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.profession}</span></div>}
                        {profileForm.education && <div style={{ background: "#0b0b0b", padding: "14px" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>EDUCAÇÃO / ESTUDOS</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{profileForm.education}</span></div>}
                      </div>


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
                        EDITAR PERFIL
                      </button>

                      <button
                        type="button"
                        onClick={() => { setScreen("myBoosts"); setMessage(""); }}
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          height: "48px",
                          background: "rgba(214, 185, 125, 0.04)",
                          border: "1px solid #c9b58a",
                          borderRadius: "2px",
                          color: "#c9b58a",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        🚀 MEUS BOOSTS
                      </button>

                      <button
                        type="button"
                        onClick={() => { setScreen("settings"); setMessage(""); }}
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          height: "48px",
                          background: "transparent",
                          border: "1px solid #c9b58a",
                          borderRadius: "2px",
                          color: "#c9b58a",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        CONFIGURAÇÕES
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "28px",
                }}
              >
                <button
                  className="back-button"
                  onClick={() => { setScreen("inside"); setMessage(""); }}
                >
                  VOLTAR
                </button>

                <span
                  style={{
                    color: "#5f5a52",
                    fontSize: "10px",
                    userSelect: "none",
                  }}
                >
                  ·
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    height: "36px",
                    padding: "0 14px",
                    border: "1px solid #292929",
                    background: "transparent",
                    color: "#c9b58a",
                    fontSize: "9px",
                    letterSpacing: "1.4px",
                    cursor: "pointer",
                  }}
                >
                  SAIR
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
                      <button type="button" className="photo-star" onClick={() => handleSetPrimary(photo.id)} disabled={photoLoading || photo.is_primary}></button>
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
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>NOME</p>
                  <input
                    type="text"
                    value={profileDisplayName}
                    onChange={(event) => setProfileDisplayName(event.target.value.slice(0, 8))}
                    maxLength={8}
                    style={{
                      width: "100%",
                      height: "48px",
                      boxSizing: "border-box",
                      background: "rgba(201, 181, 138, 0.035)",
                      border: "1px solid #292929",
                      borderRadius: "2px",
                      color: "#f4ead7",
                      padding: "0 14px",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "13px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "8px",
                    }}
                  >
                    <p
                      className="form-subtitle"
                      style={{
                        margin: 0,
                        color: "#8f897f",
                      }}
                    >
                      O nome pode ter no máximo 8 caracteres.
                    </p>
                    <span
                      style={{
                        color: profileDisplayName.length >= 8 ? "#c9b58a" : "#77736b",
                        fontSize: "9px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {profileDisplayName.length}/8
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>IDENTIDADE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {["Homem cis", "Homem trans", "Não binário"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, gender: option })} style={{ height: "44px", border: profileForm.gender === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.gender === option ? "#15130f" : "#0b0b0b", color: profileForm.gender === option ? "#f4ead7" : "#c9b58a", fontSize: "10px", letterSpacing: "0.7px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>SEXUALIDADE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {["Gay", "Bissexual", "Pansexual", "Outra"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, sexuality: option })} style={{ height: "44px", border: profileForm.sexuality === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.sexuality === option ? "#15130f" : "#0b0b0b", color: profileForm.sexuality === option ? "#f4ead7" : "#c9b58a", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>POSIÇÃO</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                    {["Ativo", "Passivo", "Versátil"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, position: option })} style={{ height: "44px", border: profileForm.position === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.position === option ? "#15130f" : "#0b0b0b", color: profileForm.position === option ? "#f4ead7" : "#c9b58a", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>DISPONIBILIDADE</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                    {["Agora", "Mais tarde", "Outro dia", "Conversar"].map((option) => (
                      <button key={option} type="button" onClick={() => setProfileForm({ ...profileForm, availability: option })} style={{ height: "44px", border: profileForm.availability === option ? "1px solid #c9b58a" : "1px solid #292929", background: profileForm.availability === option ? "#15130f" : "#0b0b0b", color: profileForm.availability === option ? "#f4ead7" : "#c9b58a", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>{option}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>PROFISSÃO</p>
                  <input
                    type="text"
                    name="profession"
                    value={profileForm.profession}
                    onChange={handleProfileChange}
                    placeholder="Ex.: Designer, empresário, estudante..."
                    maxLength={80}
                    style={{
                      width: "100%",
                      height: "48px",
                      boxSizing: "border-box",
                      background: "rgba(201, 181, 138, 0.035)",
                      border: "1px solid #292929",
                      borderRadius: "2px",
                      color: "#f4ead7",
                      padding: "0 14px",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "13px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "22px" }}>
                  <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>EDUCAÇÃO / ESTUDOS</p>
                  <input
                    type="text"
                    name="education"
                    value={profileForm.education}
                    onChange={handleProfileChange}
                    placeholder="Ex.: Publicidade, Administração, ensino médio..."
                    maxLength={100}
                    style={{
                      width: "100%",
                      height: "48px",
                      boxSizing: "border-box",
                      background: "rgba(201, 181, 138, 0.035)",
                      border: "1px solid #292929",
                      borderRadius: "2px",
                      color: "#f4ead7",
                      padding: "0 14px",
                      outline: "none",
                      fontFamily: "inherit",
                      fontSize: "13px",
                    }}
                  />
                </div>

                {[
                  { label: "INTENÇÃO", key: "intention", options: ["Relacionamento", "Conhecer", "Casual", "Amizade", "Conversar", "Ainda não sei"] },
                  { label: "VÍCIOS / HÁBITOS", key: "habits", options: ["Fuma", "Não fuma", "Bebe", "Não bebe"] },
                  { label: "HOBBIES E ESTILO DE VIDA", key: "hobbies", options: ["Academia", "Esportes", "Praia", "Natureza", "Viagens", "Games", "Filmes e séries", "Música", "Culinária", "Gastronomia", "Leitura", "Arte", "Fotografia", "Festas", "Animais", "Carros", "Tecnologia", "Cultura"] },
                  { label: "PERSONALIDADE", key: "personality", options: ["Extrovertido", "Introvertido", "Comunicativo", "Reservado", "Romântico", "Carinhoso", "Aventureiro", "Tranquilo", "Divertido", "Sério", "Espontâneo", "Caseiro", "Sociável"] },
                  { label: "RELACIONAMENTO", key: "relationship", options: ["Solteiro", "Relacionamento aberto", "Monogâmico", "Não monogâmico"] },
                  { label: "INTERESSES", key: "interests", options: ["Gastronomia", "Moda", "Negócios", "Finanças", "Cinema", "Política", "Espiritualidade"] },
                  { label: "IDIOMAS", key: "languages", options: ["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão", "Libras", "Outro"] },
                ].map((section) => (
                  <div key={section.key} style={{ marginBottom: "22px" }}>
                    <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>{section.label}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                      {section.options.map((option) => {
                        const selected = profileForm[section.key].includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setProfileForm((current) => ({
                                ...current,
                                [section.key]: selected
                                  ? current[section.key].filter((item) => item !== option)
                                  : [...current[section.key], option],
                              }))
                            }
                            style={{
                              minHeight: "44px",
                              border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                              background: selected ? "#15130f" : "#0b0b0b",
                              color: selected ? "#f4ead7" : "#c9b58a",
                              fontSize: "10px",
                              letterSpacing: "0.7px",
                              cursor: "pointer",
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

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
                <button type="submit" disabled={loading || !profileDisplayName.trim() || !profileForm.gender || !profileForm.sexuality || !profileForm.position || !profileForm.availability}>{loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}</button>
              </form>

              {message && <p className="form-subtitle">{message}</p>}

              <button className="back-button" onClick={() => setProfileEditMode(false)}>CANCELAR</button>
            </section>
          )}
        </section>
      )}

            {/* CONEXÕES / INTERESSES */}

      {screen === "likes" && (
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
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "18px",
            }}
          >
            <button
              type="button"
              onClick={() => { setScreen("inside"); setMessage(""); }}
              style={{
                border: "none",
                background: "transparent",
                color: "#c9b58a",
                fontSize: "10px",
                letterSpacing: "1.8px",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              ← VOLTAR
            </button>
          </div>

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div className="moon-logo">MOON</div>
            <p className="moon-tagline">FIND YOUR NIGHT.</p>
            <p style={{ color: "#c9b58a", fontSize: "11px", letterSpacing: "2px", marginTop: "20px" }}>
              INTERAÇÕES
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
            {[
              ["conexoes", "CONEXÕES"],
              ["interesses", "INTERESSES"],
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setLikesTab(tab);
                  if (tab === "conexoes") {
                    markNotificationsAsRead("match");
                  }
                }}
                style={{
                  height: "42px",
                  border: `1px solid ${likesTab === tab ? "#c9b58a" : "#292929"}`,
                  background: likesTab === tab ? "#15130f" : "#0b0b0b",
                  color: likesTab === tab ? "#c9b58a" : "#77736b",
                  fontSize: "10px",
                  letterSpacing: "1.8px",
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <span>{label}</span>
                  {tab === "conexoes" && notificationCount.match > 0 && (
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
                      {notificationCount.match > 99 ? "99+" : notificationCount.match}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {likesTab === "conexoes" ? (
            connectionsLoading ? (
              <MoonSkeleton rows={3} />
            ) : viewedProfiles.length === 0 ? (
              <div style={{ textAlign: "center", padding: "70px 20px", border: "1px solid #191919", background: "#0b0b0b" }}>
                <p style={{ color: "#f4ead7", fontSize: "18px", letterSpacing: "3px", marginBottom: "15px" }}>
                  NENHUMA CONEXÃO
                </p>
                <p style={{ color: "#77736b", fontSize: "12px", lineHeight: "1.7", maxWidth: "400px", margin: "0 auto" }}>
                  Quando houver uma conexão mútua, ela aparecerá aqui.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
                {viewedProfiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => handleChat(profile, "likes")}
                    style={{
                      width: "100%",
                      padding: 0,
                      border: "1px solid #202020",
                      background: "#0b0b0b",
                      cursor: "pointer",
                      overflow: "hidden",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ aspectRatio: "1 / 1", background: "#111", overflow: "hidden" }}>
                      {profile.photoUrl ? (
                        <img src={captureShieldActive ? undefined : profile.photoUrl} alt={profile.name || "Perfil"} {...protectedMediaProps} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#77736b", fontSize: "10px", letterSpacing: "1px" }}>
                          SEM FOTO
                        </div>
                      )}
                    </div>
                    <div style={{ padding: "10px" }}>
                      <div style={{ color: "#f4ead7", fontSize: "13px", fontWeight: "600", letterSpacing: "0.5px" }}>
                        {profile.name || "Usuário"}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )
          ) : likesLoading ? (
            <MoonSkeleton rows={3} />
          ) : likedProfiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "70px 20px", border: "1px solid #191919", background: "#0b0b0b" }}>
              <p style={{ color: "#f4ead7", fontSize: "18px", letterSpacing: "3px", marginBottom: "15px" }}>
                NENHUM INTERESSE
              </p>
              <p style={{ color: "#77736b", fontSize: "12px", lineHeight: "1.7", maxWidth: "400px", margin: "0 auto" }}>
                Aqui aparecem as pessoas que demonstraram interesse em você.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
              {likedProfiles.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleChat(profile, "likes")}
                  style={{
                    width: "100%",
                    padding: "0",
                    border: "1px solid #202020",
                    background: "#0b0b0b",
                    color: "#f4ead7",
                    cursor: "pointer",
                    textAlign: "left",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", background: "#101010" }}>
                    {profile.photoUrl ? (
                      <img src={captureShieldActive ? undefined : profile.photoUrl} alt={profile.name || "Perfil MOON"} {...protectedMediaProps} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b3832", fontSize: "9px", letterSpacing: "1px" }}>MOON</div>
                    )}
                  </div>
                  <div style={{ padding: "10px" }}>
                    <div style={{ color: "#f4ead7", fontSize: "12px", letterSpacing: "0.7px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {profile.name || "Sem nome"}{profile.birth_date ? `, ${calculateAge(profile.birth_date)}` : ""}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

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

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "18px",
            }}
          >
            <button
              type="button"
              onClick={() => setScreen("inside")}
              style={{
                border: "none",
                background: "transparent",
                color: "#c9b58a",
                fontSize: "10px",
                letterSpacing: "1.8px",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              ← VOLTAR
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {[
              ["all", "TODAS"],
              ["unread", "NÃO LIDAS"],
              ["online", "ONLINE"],
              ["distance", "DISTÂNCIA"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setConversationFilter(value)}
                style={{
                  minHeight: "38px",
                  border:
                    conversationFilter === value
                      ? "1px solid #c9b58a"
                      : "1px solid #2a2722",
                  background:
                    conversationFilter === value
                      ? "#15130f"
                      : "#0b0b0b",
                  color:
                    conversationFilter === value
                      ? "#f4ead7"
                      : "#c9b58a",
                  fontSize: "9px",
                  letterSpacing: "1.2px",
                  cursor: "pointer",
                  padding: "8px 5px",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {conversationsLoading ? (
            <MoonSkeleton rows={4} />
          ) : filteredConversations.length === 0 ? (
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
              {filteredConversations.map((conversation) => {
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

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "6px",
                          fontSize: "8px",
                          letterSpacing: "0.8px",
                        }}
                      >
                        <span
                          style={{
                            color:
                              getOnlineStatus(
                                profile.last_active_at
                              ) === "ATIVO AGORA"
                                ? "#c9b58a"
                                : "#77736b",
                          }}
                        >
                          ● {getOnlineStatus(profile.last_active_at)}
                        </span>

                        {conversation.distanceKm !== null && (
                          <span style={{ color: "#77736b" }}>
                            · {formatDistance(conversation.distanceKm)}
                          </span>
                        )}
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
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            handleDeleteConversation(conversation.id);
                          }
                        }}
                        aria-label="Excluir conversa"
                        title="Excluir conversa"
                        style={{
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#77736b",
                          fontSize: "14px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        ×
                      </span>

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTogglePinnedConversation(conversation.id);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            handleTogglePinnedConversation(conversation.id);
                          }
                        }}
                        aria-label={
                          pinnedConversationIds.includes(conversation.id)
                            ? "Desafixar conversa"
                            : "Fixar conversa"
                        }
                        title={
                          pinnedConversationIds.includes(conversation.id)
                            ? "Desafixar conversa"
                            : "Fixar conversa"
                        }
                        style={{
                          width: "28px",
                          height: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: pinnedConversationIds.includes(conversation.id)
                            ? "#c9b58a"
                            : "#55524c",
                          fontSize: "14px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M8 3H16L15 9L18.5 13H5.5L9 9L8 3Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 13V21"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>

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
                setChatReplyToMessage(null);
                setChatIcebreaker(null);
                setChatConnection(null);
                setChatFollowUpSuggestion(null);
                setChatDeepSuggestion(null);
                setShowChatMenu(false);
                setShowChatAttachMenu(false);
                setChatMediaMode(null);
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
                  lineHeight: 1.2,
                }}
              >
                {chatTarget?.name || "CONVERSA"}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (chatTarget?.id) {
                    openChatProfile(chatTarget);
                  }
                }}
                disabled={!chatTarget?.id}
                style={{
                  marginTop: "7px",
                  border: "1px solid #292929",
                  background: "transparent",
                  color: "#c9b58a",
                  padding: "6px 11px",
                  fontSize: "8px",
                  letterSpacing: "1.6px",
                  cursor: chatTarget?.id ? "pointer" : "default",
                  fontFamily: "inherit",
                  opacity: chatTarget?.id ? 1 : 0.5,
                }}
              >
                VER PERFIL
              </button>
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
                    BLOQUEAR USUÁRIO
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
                    DENUNCIAR USUÁRIO
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowChatMenu(false);
                      setMessage("Suas conversas e dados de perfil seguem as configurações de privacidade da MOON.");
                    }}
                    style={{ width: "100%", height: "42px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.3px", cursor: "pointer" }}
                  >
                    PRIVACIDADE
                  </button>
                </div>
              )}
            </div>
          </div>


          {chatIcebreaker && chatMessages.length === 0 && (
            <div
              style={{
                margin: "22px 0 4px",
                padding: "16px",
                border: "1px solid rgba(201,181,138,0.32)",
                background: "rgba(201,181,138,0.045)",
              }}
            >
              <div
                style={{
                  color: "#c9b58a",
                  fontSize: "8px",
                  letterSpacing: "1.8px",
                  marginBottom: "9px",
                }}
              >
                UMA IDEIA PRA COMEÇAR
              </div>
              <div
                style={{
                  color: "#f4ead7",
                  fontSize: "12px",
                  lineHeight: "1.6",
                  marginBottom: "5px",
                }}
              >
                Vocês dois têm <strong>{chatIcebreaker.connection}</strong> em comum.
              </div>
              <div
                style={{
                  color: "#77736b",
                  fontSize: "11px",
                  lineHeight: "1.6",
                  marginBottom: "12px",
                }}
              >
                {chatIcebreaker.question}
              </div>

              <button
                type="button"
                onClick={() => {
                  setChatText(chatIcebreaker.question || "");
                }}
                style={{
                  width: "100%",
                  minHeight: "38px",
                  border: "1px solid #c9b58a",
                  background: "transparent",
                  color: "#c9b58a",
                  fontSize: "9px",
                  letterSpacing: "1.5px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                USAR COMO MENSAGEM
              </button>
            </div>
          )}

          {threatWarning && (
            <div
              style={{
                marginBottom: "14px",
                border: "1px solid rgba(211,107,95,0.55)",
                background: "#120d0c",
                padding: "14px",
              }}
            >
              <div style={{ color: "#d36b5f", fontSize: "10px", letterSpacing: "1.4px", marginBottom: "8px" }}>
                ⚠️ ESSA MENSAGEM NÃO PODE SER ENVIADA.
              </div>
              <div style={{ color: "#9a817c", fontSize: "10px", lineHeight: "1.6", marginBottom: "12px" }}>
                Ameaças, chantagem e exposição de outras pessoas não são permitidas no MOON.
              </div>
              <button
                type="button"
                onClick={cancelThreatMessage}
                style={{ minHeight: "38px", border: "1px solid rgba(211,107,95,0.5)", background: "transparent", color: "#d36b5f", padding: "0 14px", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}
              >
                EDITAR MENSAGEM
              </button>
            </div>
          )}

          {offensiveWarning && (
            <div
              style={{
                marginBottom: "14px",
                border: "1px solid rgba(201,181,138,0.45)",
                background: "#11100e",
                padding: "14px",
              }}
            >
              <div style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "1.4px", marginBottom: "8px" }}>
                ⚠️ ESSA MENSAGEM PODE SER OFENSIVA.
              </div>
              <div style={{ color: "#77736b", fontSize: "10px", lineHeight: "1.6", marginBottom: "12px" }}>
                Revise a mensagem antes de enviar. Você pode editar ou continuar mesmo assim.
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleSendOffensiveMessage}
                  style={{ minHeight: "38px", border: "1px solid #c9b58a", background: "#15130f", color: "#c9b58a", padding: "0 14px", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}
                >
                  ENVIAR MESMO ASSIM
                </button>
                <button
                  type="button"
                  onClick={() => { setOffensiveWarning(false); setOffensivePendingContent(""); setChatText(offensivePendingContent); }}
                  style={{ minHeight: "38px", border: "1px solid #292929", background: "transparent", color: "#77736b", padding: "0 14px", fontSize: "9px", letterSpacing: "1px", cursor: "pointer" }}
                >
                  EDITAR
                </button>
              </div>
            </div>
          )}

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
                  id={`moon-chat-message-${chatMessage.id}`}
                  onClick={() => selectChatMessageForReply(chatMessage)}
                  title={chatMessage.deleted_for_everyone ? undefined : "Responder mensagem"}
                  style={{
                    alignSelf:
                      chatMessage.sender_id === currentUserId
                        ? "flex-end"
                        : "flex-start",
                    maxWidth: "75%",
                    padding: "11px 14px",
                    border:
                      chatMessage.sender_id === currentUserId
                        ? "1px solid #d8c69f"
                        : "1px solid #3a352d",
                    background:
                      chatMessage.sender_id === currentUserId
                        ? "#d6c08f"
                        : "#151515",
                    color:
                      chatMessage.sender_id === currentUserId
                        ? "#050505"
                        : "#f4ead7",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    cursor: chatMessage.deleted_for_everyone ? "default" : "pointer",
                    transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
                    boxShadow:
                      chatReplyToMessage?.id === chatMessage.id
                        ? "0 0 0 1px rgba(201,181,138,0.35), 0 8px 24px rgba(0,0,0,0.22)"
                        : "none",
                    transform:
                      chatReplyToMessage?.id === chatMessage.id
                        ? "translateY(-1px)"
                        : "translateY(0)",
                  }}
                >
                  {chatMessage.reply_to_message_id && (() => {
                    const repliedMessage = chatMessages.find(
                      (message) => message.id === chatMessage.reply_to_message_id
                    );

                    if (!repliedMessage) return null;

                    const repliedContent = repliedMessage.deleted_for_everyone
                      ? "Mensagem excluída."
                      : repliedMessage.message_type === "text"
                        ? repliedMessage.content || "Mensagem"
                        : repliedMessage.message_type === "image"
                          ? "Foto"
                          : repliedMessage.message_type === "video"
                            ? "Vídeo"
                            : repliedMessage.message_type === "audio"
                              ? "Áudio"
                              : repliedMessage.message_type === "location"
                                ? "Localização"
                                : "Mensagem";

                    return (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          const element = document.getElementById(
                            `moon-chat-message-${repliedMessage.id}`
                          );
                          element?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        style={{
                          marginBottom: "9px",
                          padding: "7px 9px",
                          borderLeft: "2px solid #c9b58a",
                          background:
                            chatMessage.sender_id === currentUserId
                              ? "rgba(5,5,5,0.12)"
                              : "rgba(201,181,138,0.07)",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "8px",
                            letterSpacing: "1px",
                            color:
                              chatMessage.sender_id === currentUserId
                                ? "#3b3427"
                                : "#c9b58a",
                            marginBottom: "3px",
                          }}
                        >
                          {repliedMessage.sender_id === currentUserId
                            ? "VOCÊ"
                            : chatTarget?.name || "PERFIL"}
                        </div>
                        <div
                          style={{
                            fontSize: "9px",
                            lineHeight: "1.35",
                            opacity: 0.78,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {repliedContent}
                        </div>
                      </div>
                    );
                  })()}

                  {chatMessage.deleted_for_everyone ? (
                    <div style={{ fontStyle: "italic", opacity: 0.65 }}>
                      Mensagem excluída.
                    </div>
                  ) : chatMessage.message_type === "location" ? (
                    <div>
                      <div style={{ fontSize: "10px", letterSpacing: "1px", marginBottom: "8px" }}>
                        LOCALIZAÇÃO COMPARTILHADA
                      </div>
                      {chatMessage.latitude !== null && chatMessage.latitude !== undefined && chatMessage.longitude !== null && chatMessage.longitude !== undefined ? (
                        <a
                          href={`https://www.google.com/maps?q=${chatMessage.latitude},${chatMessage.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "inherit", textDecoration: "underline", fontSize: "11px" }}
                        >
                          ABRIR NO MAPA
                        </a>
                      ) : (
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>Localização indisponível.</div>
                      )}
                    </div>
                  ) : chatMessage.message_type === "audio" ? (
                    <div style={{ minWidth: "220px", maxWidth: "100%" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "1px", marginBottom: "7px", opacity: 0.75 }}>
                        {chatMessage.media_expired ? "ÁUDIO EXPIRADO" : "ÁUDIO"}
                      </div>
                      {chatMessage.media_expired ? (
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>Este áudio não está mais disponível.</div>
                      ) : chatMessage.media_signed_url ? (
                        <audio src={captureShieldActive ? undefined : chatMessage.media_signed_url} controls preload="metadata" style={{ width: "100%", maxWidth: "280px" }} onContextMenu={(event) => event.preventDefault()} />
                      ) : (
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>Carregando áudio...</div>
                      )}
                    </div>
                  ) : chatMessage.message_type === "image" || chatMessage.message_type === "video" ? (
                    <div>
                      <div style={{ fontSize: "10px", letterSpacing: "1px", marginBottom: "8px", opacity: 0.8 }}>
                        {chatMessage.media_expired ? "MÍDIA EXPIRADA" : chatMessage.message_type === "video" ? "VÍDEO TEMPORÁRIO" : "FOTO TEMPORÁRIA"}
                      </div>
                      {chatMessage.media_expired ? (
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>Esta mídia não está mais disponível.</div>
                      ) : chatMessage.media_signed_url ? (
                        chatMessage.sender_id !== currentUserId &&
                        chatMessage.is_intimate &&
                        intimateContentPreference === "block" ? (
                          <div style={{ width: "260px", maxWidth: "100%", padding: "22px 18px", border: "1px solid #292929", background: "#101010", textAlign: "center" }}>
                            <div style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "1.3px", marginBottom: "8px" }}>
                              CONTEÚDO ÍNTIMO BLOQUEADO
                            </div>
                            <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.5" }}>
                              Você escolheu não receber conteúdo íntimo.
                            </div>
                          </div>
                        ) : chatMessage.message_type === "image" &&
                          chatMessage.sender_id !== currentUserId &&
                          dismissedIntimateMessageIds.includes(chatMessage.id) ? (
                          <div style={{ width: "260px", maxWidth: "100%", padding: "22px 18px", border: "1px solid #292929", background: "#101010", textAlign: "center" }}>
                            <div style={{ color: "#77736b", fontSize: "10px", letterSpacing: "1.2px", marginBottom: "8px" }}>
                              FOTO NÃO VISUALIZADA
                            </div>
                            <div style={{ color: "#55524d", fontSize: "9px", lineHeight: "1.5" }}>
                              Você escolheu não visualizar esta foto temporária.
                            </div>
                          </div>
                        ) : chatMessage.sender_id !== currentUserId &&
                          chatMessage.is_intimate &&
                          intimateContentPreference === "confirm" &&
                          !chatRevealedPhotoIds.includes(chatMessage.id) &&
                          !dismissedIntimateMessageIds.includes(chatMessage.id) ? (
                          <div style={{ width: "260px", maxWidth: "100%", padding: "22px 18px", border: "1px solid rgba(201,181,138,0.35)", background: "#101010", textAlign: "center" }}>
                            <div style={{ color: "#c9b58a", fontSize: "11px", letterSpacing: "1.2px", marginBottom: "8px" }}>
                              🔒 CONTEÚDO ÍNTIMO
                            </div>
                            <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.5", marginBottom: "16px" }}>
                              Esta mídia foi marcada como conteúdo íntimo. Você quer visualizar?
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button type="button" onClick={() => setChatRevealedPhotoIds((ids) => ids.includes(chatMessage.id) ? ids : [...ids, chatMessage.id])} style={{ flex: 1, minHeight: "34px", border: "1px solid #c9b58a", background: "#15130f", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.1px", cursor: "pointer" }}>VER</button>
                              <button type="button" onClick={() => setDismissedIntimateMessageIds((ids) => ids.includes(chatMessage.id) ? ids : [...ids, chatMessage.id])} style={{ flex: 1, minHeight: "34px", border: "1px solid #292929", background: "transparent", color: "#77736b", fontSize: "9px", letterSpacing: "1.1px", cursor: "pointer" }}>NÃO VER</button>
                            </div>
                          </div>
                        ) : chatMessage.message_type === "image" &&
                        chatMessage.sender_id !== currentUserId &&
                        chatPhotoConfirmationEnabled &&
                        !chatRevealedPhotoIds.includes(chatMessage.id) ? (
                          <div style={{ width: "260px", maxWidth: "100%" }}>
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "260px",
                                overflow: "hidden",
                                background: "#101010",
                                border: "1px solid #292929",
                              }}
                            >
                              <img
                                src={captureShieldActive ? undefined : chatMessage.media_signed_url}
                                alt="Foto recebida"
                                {...protectedMediaProps}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  filter: "blur(18px)",
                                  transform: "scale(1.08)",
                                  opacity: captureShieldActive ? 0 : 0.72,
                                }}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "20px",
                                  textAlign: "center",
                                  background: "rgba(5,5,5,0.42)",
                                }}
                              >
                                <div style={{ color: "#f4ead7", fontSize: "12px", letterSpacing: "1px", marginBottom: "7px" }}>
                                  Foto recebida
                                </div>
                                <div style={{ color: "#aaa59b", fontSize: "10px", lineHeight: "1.5", marginBottom: "16px" }}>
                                  Esta foto está oculta.
                                </div>
                                <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "210px" }}>
                                  <button
                                    type="button"
                                    onClick={() => setChatRevealedPhotoIds((currentIds) => currentIds.includes(chatMessage.id) ? currentIds : [...currentIds, chatMessage.id])}
                                    style={{
                                      flex: 1,
                                      minHeight: "34px",
                                      border: "1px solid #c9b58a",
                                      background: "#15130f",
                                      color: "#c9b58a",
                                      fontSize: "9px",
                                      letterSpacing: "1.2px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    VER
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDismissedIntimateMessageIds((currentIds) =>
                                      currentIds.includes(chatMessage.id)
                                        ? currentIds
                                        : [...currentIds, chatMessage.id]
                                    )}
                                    style={{
                                      flex: 1,
                                      minHeight: "34px",
                                      border: "1px solid #292929",
                                      background: "rgba(0,0,0,0.3)",
                                      color: "#77736b",
                                      fontSize: "9px",
                                      letterSpacing: "1.2px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    NÃO VER
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : chatMessage.message_type === "video" ? (
                          <video
                            src={captureShieldActive ? undefined : chatMessage.media_signed_url}
                            controls
                            playsInline
                            {...protectedMediaProps}
                            style={{ display: "block", maxWidth: "260px", maxHeight: "360px", width: "100%" }}
                          />
                        ) : (
                          <img
                            src={captureShieldActive ? undefined : chatMessage.media_signed_url}
                            alt="Mídia temporária"
                            {...protectedMediaProps}
                            style={{ display: "block", maxWidth: "260px", maxHeight: "360px", width: "100%", objectFit: "cover" }}
                          />
                        )
                      ) : (
                        <div style={{ fontSize: "10px", opacity: 0.7 }}>Não foi possível carregar a mídia.</div>
                      )}
                    </div>
                  ) : (
                    <div>{chatMessage.content}</div>
                  )}
                  {chatMessage.sender_id !== currentUserId &&
                    !chatMessage.deleted_for_everyone &&
                    chatMessage.message_type === "text" &&
                    messageMayBeThreatening(chatMessage.content) &&
                    !dismissedThreatMessageIds.includes(chatMessage.id) && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(211,107,95,0.28)" }}>
                      <div style={{ color: "#d36b5f", fontSize: "9px", letterSpacing: "1px", lineHeight: "1.5", marginBottom: "7px" }}>
                        ⚠️ ISSO ACONTECEU COM VOCÊ?
                      </div>
                      <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.5", marginBottom: "9px" }}>
                        Ameaças, chantagem e exposição são tratadas como questões de segurança no MOON.
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => {
                          setReportTarget(chatTarget || null);
                          setReportReason("Me senti ameaçado");
                          setReportDescription(`Denúncia de segurança relacionada à mensagem ${chatMessage.id}.`);
                          dismissThreatMessageWarning(chatMessage.id);
                        }} style={{ minHeight: "32px", border: "1px solid rgba(211,107,95,0.45)", background: "transparent", color: "#d36b5f", padding: "0 10px", fontSize: "8px", letterSpacing: "0.8px", cursor: "pointer" }}>
                          DENUNCIAR
                        </button>
                        <button type="button" onClick={() => dismissThreatMessageWarning(chatMessage.id)} style={{ minHeight: "32px", border: "1px solid #292929", background: "transparent", color: "#77736b", padding: "0 10px", fontSize: "8px", letterSpacing: "0.8px", cursor: "pointer" }}>
                          IGNORAR
                        </button>
                      </div>
                    </div>
                  )}

                  {chatMessage.sender_id !== currentUserId &&
                    !chatMessage.deleted_for_everyone &&
                    chatMessage.message_type === "text" &&
                    messageMayBeOffensive(chatMessage.content) &&
                    !dismissedOffensiveMessageIds.includes(chatMessage.id) && (
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(201,181,138,0.18)",
                      }}
                    >
                      <div
                        style={{
                          color: "#c9b58a",
                          fontSize: "9px",
                          letterSpacing: "1px",
                          lineHeight: "1.5",
                          marginBottom: "8px",
                        }}
                      >
                        ⚠️ ESSA MENSAGEM TE INCOMODOU?
                      </div>
                      <div
                        style={{
                          color: "#77736b",
                          fontSize: "9px",
                          lineHeight: "1.5",
                          marginBottom: "9px",
                        }}
                      >
                        Conte pra gente o que aconteceu.
                      </div>
                      <div style={{ display: "grid", gap: "5px" }}>
                        {[
                          "Fui ofendido",
                          "Fui assediado",
                          "Fui humilhado",
                          "Recebi algo que não queria",
                          "Me senti ameaçado",
                          "Outro",
                        ].map((reason) => (
                          <button
                            key={`${chatMessage.id}-${reason}`}
                            type="button"
                            onClick={() => {
                              setReportTarget(chatTarget || null);
                              setReportReason(reason);
                              setReportDescription(`Denúncia contextual relacionada à mensagem ${chatMessage.id}.`);
                              dismissOffensiveMessageWarning(chatMessage.id);
                            }}
                            style={{
                              minHeight: "30px",
                              border: "1px solid #292929",
                              background: "transparent",
                              color: "#8f8a81",
                              textAlign: "left",
                              padding: "0 8px",
                              fontSize: "8px",
                              letterSpacing: "0.6px",
                              cursor: "pointer",
                            }}
                          >
                            {reason}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => dismissOffensiveMessageWarning(chatMessage.id)}
                          style={{
                            minHeight: "30px",
                            border: "1px solid #292929",
                            background: "transparent",
                            color: "#77736b",
                            fontSize: "8px",
                            letterSpacing: "0.8px",
                            cursor: "pointer",
                          }}
                        >
                          FOI ENGANO
                        </button>
                      </div>
                    </div>
                  )}

                  {chatMessage.sender_id !== currentUserId &&
                    !chatMessage.deleted_for_everyone &&
                    chatMessage.message_type === "text" &&
                    chatRefusalMarkedAt &&
                    chatMessage.created_at &&
                    new Date(chatMessage.created_at).getTime() > new Date(chatRefusalMarkedAt).getTime() &&
                    !dismissedInsistenceWarningMessageIds.includes(chatMessage.id) && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(201,181,138,0.18)" }}>
                      <div style={{ color: "#c9b58a", fontSize: "9px", letterSpacing: "1px", lineHeight: "1.5", marginBottom: "8px" }}>
                        ⚠️ VOCÊ JÁ DISSE QUE NÃO TINHA INTERESSE.
                      </div>
                      <div style={{ color: "#77736b", fontSize: "9px", lineHeight: "1.5", marginBottom: "9px" }}>
                        Essa pessoa continuou a conversa depois da sua recusa. Você pode ignorar, denunciar ou bloquear.
                      </div>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        <button type="button" onClick={() => { dismissInsistenceWarning(chatMessage.id); setReportTarget(chatTarget || null); setReportReason("Insistência após recusa"); setReportDescription(`Denúncia contextual relacionada à insistência após recusa na mensagem ${chatMessage.id}.`); }} style={{ minHeight: "30px", border: "1px solid #292929", background: "transparent", color: "#8f8a81", padding: "0 8px", fontSize: "8px", letterSpacing: "0.6px", cursor: "pointer" }}>DENUNCIAR</button>
                        <button type="button" onClick={() => { dismissInsistenceWarning(chatMessage.id); handleBlock(chatTarget); }} style={{ minHeight: "30px", border: "1px solid rgba(211,107,95,0.45)", background: "transparent", color: "#d36b5f", padding: "0 8px", fontSize: "8px", letterSpacing: "0.6px", cursor: "pointer" }}>BLOQUEAR</button>
                        <button type="button" onClick={() => dismissInsistenceWarning(chatMessage.id)} style={{ minHeight: "30px", border: "1px solid #292929", background: "transparent", color: "#77736b", padding: "0 8px", fontSize: "8px", letterSpacing: "0.6px", cursor: "pointer" }}>IGNORAR</button>
                      </div>
                    </div>
                  )}

                  {chatMessage.sender_id === currentUserId && (
                    <div
                      style={{
                        marginTop: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "8px",
                      }}
                    >
                      {!chatMessage.deleted_for_everyone && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMessageForEveryone(chatMessage.id)
                          }
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#050505",
                            padding: 0,
                            fontSize: "9px",
                            letterSpacing: "0.5px",
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          EXCLUIR
                        </button>
                      )}
                      {!chatMessage.deleted_for_everyone && (
                        <div
                          style={{
                            fontSize: "9px",
                            letterSpacing: "0.5px",
                            opacity: 0.7,
                          }}
                        >
                          {chatMessage.read_at ? "✓✓" : "✓"}
                        </div>
                      )}
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

          {abusiveRestrictionUntil && abusiveRestrictionUntil > Date.now() && (
            <div
              style={{
                margin: "0 0 12px",
                padding: "14px 16px",
                border: "1px solid rgba(211,107,95,0.35)",
                background: "rgba(211,107,95,0.035)",
              }}
            >
              <div
                style={{
                  color: "#d36b5f",
                  fontSize: "9px",
                  letterSpacing: "1.5px",
                  marginBottom: "7px",
                }}
              >
                RESTRIÇÃO TEMPORÁRIA
              </div>
              <div
                style={{
                  color: "#8f8a81",
                  fontSize: "10px",
                  lineHeight: "1.5",
                }}
              >
                {getAbusiveRestrictionMessage()}
              </div>
            </div>
          )}

          {chatFollowUpSuggestion && chatMessages.length >= 4 && (
            <div
              style={{
                margin: "0 0 12px",
                padding: "14px 16px",
                border: "1px solid rgba(201,181,138,0.25)",
                background: "rgba(201,181,138,0.035)",
              }}
            >
              <div
                style={{
                  color: "#c9b58a",
                  fontSize: "8px",
                  letterSpacing: "1.7px",
                  marginBottom: "8px",
                }}
              >
                UMA IDEIA PRA CONTINUAR
              </div>
              <div
                style={{
                  color: "#77736b",
                  fontSize: "11px",
                  lineHeight: "1.6",
                  marginBottom: "11px",
                }}
              >
                {chatFollowUpSuggestion.question}
              </div>
              <button
                type="button"
                onClick={() => {
                  setChatText(chatFollowUpSuggestion.question || "");
                }}
                style={{
                  width: "100%",
                  minHeight: "36px",
                  border: "1px solid #292929",
                  background: "transparent",
                  color: "#c9b58a",
                  fontSize: "9px",
                  letterSpacing: "1.4px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                USAR COMO MENSAGEM
              </button>
            </div>
          )}

          {chatDeepSuggestion && chatMessages.length >= 8 && (
            <div
              style={{
                margin: "0 0 12px",
                padding: "14px 16px",
                border: "1px solid rgba(201,181,138,0.18)",
                background: "rgba(201,181,138,0.02)",
              }}
            >
              <div
                style={{
                  color: "#c9b58a",
                  fontSize: "8px",
                  letterSpacing: "1.7px",
                  marginBottom: "8px",
                }}
              >
                E AGORA?
              </div>
              <div
                style={{
                  color: "#77736b",
                  fontSize: "11px",
                  lineHeight: "1.6",
                  marginBottom: "11px",
                }}
              >
                {chatDeepSuggestion.question}
              </div>
              <button
                type="button"
                onClick={() => {
                  setChatText(chatDeepSuggestion.question || "");
                }}
                style={{
                  width: "100%",
                  minHeight: "36px",
                  border: "1px solid #292929",
                  background: "transparent",
                  color: "#c9b58a",
                  fontSize: "9px",
                  letterSpacing: "1.4px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                USAR COMO MENSAGEM
              </button>
            </div>
          )}

          {chatTyping && (
            <div
              style={{
                minHeight: "16px",
                paddingTop: "8px",
                color: "#c9b58a",
                fontSize: "10px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              Digitando...
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
            <button type="button" onClick={markChatRefusal} style={{ minHeight: "30px", border: "1px solid #292929", background: "transparent", color: "#77736b", padding: "0 10px", fontSize: "8px", letterSpacing: "1px", cursor: "pointer" }}>
              NÃO TENHO INTERESSE
            </button>
          </div>

          {chatReplyToMessage && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px 12px",
                border: "1px solid #292929",
                borderLeft: "2px solid #c9b58a",
                background: "#101010",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                animation: "moonReplyPreviewIn 180ms ease-out",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: "#c9b58a",
                    fontSize: "8px",
                    letterSpacing: "1.2px",
                    marginBottom: "4px",
                  }}
                >
                  RESPONDENDO A{" "}
                  {chatReplyToMessage.sender_id === currentUserId
                    ? "VOCÊ"
                    : chatTarget?.name || "PERFIL"}
                </div>
                <div
                  style={{
                    color: "#77736b",
                    fontSize: "10px",
                    lineHeight: "1.4",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chatReplyToMessage.message_type === "text"
                    ? chatReplyToMessage.content || "Mensagem"
                    : chatReplyToMessage.message_type === "image"
                      ? "Foto"
                      : chatReplyToMessage.message_type === "video"
                        ? "Vídeo"
                        : chatReplyToMessage.message_type === "audio"
                          ? "Áudio"
                          : chatReplyToMessage.message_type === "location"
                            ? "Localização"
                            : "Mensagem"}
                </div>
              </div>

              <button
                type="button"
                onClick={cancelChatReply}
                aria-label="Cancelar resposta"
                title="Cancelar resposta"
                style={{
                  width: "28px",
                  height: "28px",
                  border: "1px solid #292929",
                  background: "transparent",
                  color: "#77736b",
                  cursor: "pointer",
                  fontSize: "15px",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
            </div>
          )}

          <style>{`
            @keyframes moonReplyPreviewIn {
              from {
                opacity: 0;
                transform: translateY(5px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          <form
            onSubmit={handleSendMessage}
            style={{
              display: "flex",
              gap: "8px",
              borderTop: "1px solid #202020",
              paddingTop: "18px",
              position: "relative",
            }}
          >
            <input
              ref={chatMediaInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChatMediaChange}
              style={{ display: "none" }}
            />
            <input
              ref={chatGalleryInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleChatMediaChange}
              style={{ display: "none" }}
            />
            <input
              ref={chatVideoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleChatMediaChange}
              style={{ display: "none" }}
            />

            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => setShowChatAttachMenu((value) => !value)}
                disabled={chatMediaLoading}
                aria-label="Anexar conteúdo"
                style={{
                  width: "48px",
                  height: "48px",
                  border: "1px solid #292929",
                  background: "transparent",
                  color: "#c9b58a",
                  cursor: chatMediaLoading ? "not-allowed" : "pointer",
                  fontSize: "22px",
                  opacity: chatMediaLoading ? 0.45 : 1,
                }}
              >
                +
              </button>

              {showChatAttachMenu && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "56px",
                    left: 0,
                    width: "190px",
                    background: "#0b0b0b",
                    border: "1px solid #292929",
                    boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
                    zIndex: 80,
                    padding: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setChatMediaIntimate((value) => !value)}
                    style={{ width: "100%", minHeight: "40px", border: chatMediaIntimate ? "1px solid #c9b58a" : "1px solid #292929", background: chatMediaIntimate ? "#15130f" : "transparent", color: chatMediaIntimate ? "#c9b58a" : "#77736b", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.2px", cursor: "pointer" }}
                  >
                    {chatMediaIntimate ? "✓ CONTEÚDO ÍNTIMO" : "MARCAR COMO ÍNTIMO"}
                  </button>
                  <button type="button" onClick={() => openChatMediaPicker("camera")} style={{ width: "100%", height: "40px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.2px", cursor: "pointer" }}>
                    CÂMERA · FOTO
                  </button>
                  <button type="button" onClick={() => openChatMediaPicker("gallery")} style={{ width: "100%", height: "40px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.2px", cursor: "pointer" }}>
                    GALERIA · FOTO
                  </button>
                  <button type="button" onClick={() => openChatMediaPicker("video")} style={{ width: "100%", height: "40px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.2px", cursor: "pointer" }}>
                    VÍDEO TEMPORÁRIO
                  </button>
                  <button type="button" onClick={handleSendLocation} style={{ width: "100%", height: "40px", border: "none", background: "transparent", color: "#c9b58a", textAlign: "left", padding: "0 12px", fontSize: "9px", letterSpacing: "1.2px", cursor: "pointer" }}>
                    ENVIAR LOCALIZAÇÃO
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={chatText}
              onChange={(event) => {
                const value = event.target.value;
                setChatText(value);

                if (chatTypingTimeoutRef.current) {
                  clearTimeout(chatTypingTimeoutRef.current);
                  chatTypingTimeoutRef.current = null;
                }

                const channel = chatRealtimeChannelRef.current;
                const canBroadcastTyping =
                  Boolean(channel) &&
                  Boolean(currentUserId) &&
                  chatChannelReadyRef.current;

                if (canBroadcastTyping) {
                  channel.send({
                    type: "broadcast",
                    event: "typing",
                    payload: {
                      userId: currentUserId,
                      isTyping: Boolean(value.trim()),
                    },
                  });
                }

                if (value.trim()) {
                  chatTypingTimeoutRef.current = setTimeout(() => {
                    const activeChannel = chatRealtimeChannelRef.current;

                    if (
                      activeChannel &&
                      currentUserId &&
                      chatChannelReadyRef.current
                    ) {
                      activeChannel.send({
                        type: "broadcast",
                        event: "typing",
                        payload: {
                          userId: currentUserId,
                          isTyping: false,
                        },
                      });
                    }

                    chatTypingTimeoutRef.current = null;
                  }, 1200);
                }
              }}
              placeholder={chatBlocked ? "ESTA CONTA ESTÁ INDISPONÍVEL" : abusiveRestrictionUntil && abusiveRestrictionUntil > Date.now() ? "Abordagem temporariamente restrita" : "Escreva uma mensagem..."}
              disabled={chatBlocked || Boolean(abusiveRestrictionUntil && abusiveRestrictionUntil > Date.now())}
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
              disabled={!chatText.trim() || Boolean(abusiveRestrictionUntil && abusiveRestrictionUntil > Date.now())}
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
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {selectedProfileFromMap && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProfile(null);
                          setSelectedProfileFromMap(false);
                          setScreen("map");
                        }}
                        style={{ height: "30px", padding: "0 10px", border: "1px solid #c9b58a", background: "transparent", color: "#c9b58a", fontSize: "8px", letterSpacing: "1.2px", cursor: "pointer" }}
                      >
                        VOLTAR AO MAPA
                      </button>
                    )}
                    <div style={{ color: "#77736b", fontSize: "9px", letterSpacing: "2px" }}>PERFIL MOON</div>
                  </div>
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
                          BLOQUEAR USUÁRIO
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
                          DENUNCIAR USUÁRIO
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
                          PRIVACIDADE
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
                  <MoonSkeleton rows={2} />
                ) : (
                  <>
                    {selectedProfilePhotos.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: selectedProfilePhotos.length === 1 ? "1fr" : "repeat(2, 1fr)", gap: "6px", marginBottom: "18px" }}>
                        {selectedProfilePhotos.map((photo) => (
                          <img
                            key={photo.id}
                            src={captureShieldActive ? undefined : photo.publicUrl}
                            alt={selectedProfile.name || "Perfil MOON"}
                            {...protectedMediaProps}
                            style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }}
                          />
                        ))}
                      </div>
                    ) : selectedProfile.photoUrl ? (
                      <div style={{ marginBottom: "18px" }}>
                        <img
                          src={captureShieldActive ? undefined : selectedProfile.photoUrl}
                          alt={selectedProfile.name || "Perfil MOON"}
                          {...protectedMediaProps}
                          style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", display: "block" }}
                        />
                      </div>
                    ) : null}

                    <div style={{ marginBottom: "18px" }}>
                      <h2 style={{ margin: 0, color: "#f4ead7", fontSize: "24px", fontWeight: "400", letterSpacing: "1px" }}>
                        {selectedProfile.name || "Sem nome"}{selectedProfile.birth_date ? `, ${calculateAge(selectedProfile.birth_date)}` : ""}
                      </h2>
                      <div style={{ color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginTop: "7px" }}>
                        {getOnlineStatus(selectedProfile.last_active_at) || "OFFLINE"}
                        {selectedProfile.distance_km !== undefined && selectedProfile.distance_km !== null ? ` · ${formatDistance(selectedProfile.distance_km)}` : ""}
                      </div>
                    </div>



                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px", marginBottom: "18px" }}>
                      {selectedProfile.gender && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>IDENTIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.gender}</span></div>}
                      {selectedProfile.sexuality && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>SEXUALIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.sexuality}</span></div>}
                      {selectedProfile.position && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>POSIÇÃO</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.position}</span></div>}
                      {selectedProfile.availability && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>DISPONIBILIDADE</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.availability}</span></div>}
                      {selectedProfile.profession && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>PROFISSÃO</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.profession}</span></div>}
                      {selectedProfile.education && <div style={{ background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}><span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "5px" }}>EDUCAÇÃO / ESTUDOS</span><span style={{ color: "#e9dfcd", fontSize: "12px" }}>{selectedProfile.education}</span></div>}
                    </div>

                    {[
                      { label: "INTENÇÃO", value: selectedProfile.intention },
                      { label: "VÍCIOS / HÁBITOS", value: selectedProfile.habits },
                      { label: "HOBBIES E ESTILO DE VIDA", value: selectedProfile.hobbies },
                      { label: "PERSONALIDADE", value: selectedProfile.personality },
                      { label: "RELACIONAMENTO", value: selectedProfile.relationship },
                      { label: "INTERESSES", value: selectedProfile.interests },
                      { label: "IDIOMAS", value: selectedProfile.languages },
                    ].map((section) => {
                      const values = Array.isArray(section.value) ? section.value.filter(Boolean) : [];
                      if (!values.length) return null;

                      return (
                        <div key={section.label} style={{ marginBottom: "18px", background: "#0b0b0b", padding: "14px", border: "1px solid #202020" }}>
                          <span style={{ display: "block", color: "#c9b58a", fontSize: "9px", letterSpacing: "1.5px", marginBottom: "9px" }}>{section.label}</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                            {values.map((value) => (
                              <span key={value} style={{ border: "1px solid #292929", color: "#e9dfcd", padding: "7px 9px", fontSize: "10px", letterSpacing: "0.4px" }}>
                                {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    {(() => {
                      const commonConnections = getCommonConnections(selectedProfile);

                      if (!commonConnections.length) return null;

                      return (
                        <div style={{ marginBottom: "18px", background: "#0b0b0b", padding: "16px", border: "1px solid #202020" }}>
                          <div style={{ color: "#f4ead7", fontSize: "12px", letterSpacing: "1.5px", marginBottom: "6px" }}>
                            VOCÊS TÊM {commonConnections.length} {commonConnections.length === 1 ? "CONEXÃO" : "CONEXÕES"}
                          </div>
                          <div style={{ color: "#77736b", fontSize: "10px", lineHeight: "1.6", marginBottom: "12px" }}>
                            Alguns interesses e formas de viver que vocês compartilham.
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                            {commonConnections.map((connection) => (
                              <span key={connection} style={{ border: "1px solid #c9b58a", color: "#c9b58a", padding: "7px 9px", fontSize: "10px", letterSpacing: "0.4px" }}>
                                {connection}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button type="button" onClick={() => { handleLike(selectedProfile.id, selectedProfile); }} style={{ flex: 1, height: "44px", border: "1px solid #c9b58a", background: "transparent", color: "#f4ead7", cursor: "pointer", fontSize: "11px", letterSpacing: "1.8px", fontWeight: "500" }}>CURTIR</button>
                      <button type="button" onClick={() => { setSelectedProfile(null); handleChat(selectedProfile, "inside"); }} style={{ flex: 1, height: "44px", border: "1px solid #c9b58a", background: "transparent", color: "#f4ead7", cursor: "pointer", fontSize: "11px", letterSpacing: "1.8px", fontWeight: "500" }}>MENSAGEM</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}


      {screen === "filters" && (
        <section
          style={{
            width: "100%",
            maxWidth: "620px",
            minHeight: "100vh",
            padding: "35px 20px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "35px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setScreen("inside");
              }}
              title="Voltar para Discovery"
              style={{
                width: "42px",
                height: "36px",
                border: "1px solid #292929",
                background: "#0b0b0b",
                color: "#c9b58a",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ←
            </button>

            <div
              style={{
                color: "#f4ead7",
                fontSize: "15px",
                letterSpacing: "4px",
                textAlign: "center",
                flex: 1,
              }}
            >
              FILTROS
            </div>

            <button
              type="button"
              onClick={cancelFilters}
              title="Cancelar e limpar filtros"
              style={{
                width: "42px",
                height: "36px",
                border: "1px solid #292929",
                background: "#0b0b0b",
                color: "#c9b58a",
                fontSize: "17px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              border: "1px solid #292929",
              background: "#0b0b0b",
              padding: "20px",
            }}
          >
            <p
              style={{
                color: "#77736b",
                fontSize: "9px",
                letterSpacing: "1.6px",
                margin: "0 0 22px",
                textAlign: "center",
              }}
            >
              DEFINA COMO VOCÊ QUER ENCONTRAR PESSOAS
            </p>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                IDADE
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px" }}>
                  MÍNIMO
                  <select
                    value={filterDraftMinAge}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setFilterDraftMinAge(value);
                      if (value > filterDraftMaxAge) setFilterDraftMaxAge(value);
                    }}
                    style={{
                      width: "100%",
                      marginTop: "6px",
                      background: "#101010",
                      color: "#e9dfcd",
                      border: "1px solid #292929",
                      padding: "11px",
                      outline: "none",
                    }}
                  >
                    {Array.from({ length: 48 }, (_, i) => i + 18).map((age) => (
                      <option key={age} value={age}>{age} anos</option>
                    ))}
                  </select>
                </label>

                <label style={{ color: "#77736b", fontSize: "8px", letterSpacing: "1.2px" }}>
                  MÁXIMO
                  <select
                    value={filterDraftMaxAge}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setFilterDraftMaxAge(value);
                      if (value < filterDraftMinAge) setFilterDraftMinAge(value);
                    }}
                    style={{
                      width: "100%",
                      marginTop: "6px",
                      background: "#101010",
                      color: "#e9dfcd",
                      border: "1px solid #292929",
                      padding: "11px",
                      outline: "none",
                    }}
                  >
                    {Array.from({ length: 48 }, (_, i) => i + 18).map((age) => (
                      <option key={age} value={age}>{age === 65 ? "65+" : `${age} anos`}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                IDENTIDADE
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Homem cis", "Não binário", "Homem trans", "Mulher trans", "Outra"].map((option) => {
                  const selected = filterDraftIdentity.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftIdentity((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "9px",
                        letterSpacing: "0.7px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                SEXUALIDADE
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {["Gay", "Bissexual", "Pansexual", "Outra"].map((option) => {
                  const selected = filterDraftSexuality.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftSexuality((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        height: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                INTENÇÃO
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {["Relacionamento", "Conhecer", "Casual", "Amizade", "Conversar", "Ainda não sei"].map((option) => {
                  const selected = filterDraftIntention.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftIntention((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                VÍCIOS / HÁBITOS
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {["Fuma", "Não fuma", "Bebe", "Não bebe"].map((option) => {
                  const selected = filterDraftHabits.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftHabits((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                HOBBIES E ESTILO DE VIDA
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Academia", "Esportes", "Praia", "Natureza", "Viagens", "Games", "Filmes e séries", "Música", "Culinária", "Gastronomia", "Leitura", "Arte", "Fotografia", "Festas", "Animais", "Carros", "Tecnologia", "Cultura"].map((option) => {
                  const selected = filterDraftHobbies.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftHobbies((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                PERSONALIDADE
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Extrovertido", "Introvertido", "Comunicativo", "Reservado", "Romântico", "Carinhoso", "Aventureiro", "Tranquilo", "Divertido", "Sério", "Espontâneo", "Caseiro", "Sociável"].map((option) => {
                  const selected = filterDraftPersonality.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftPersonality((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                RELACIONAMENTO
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {["Solteiro", "Relacionamento aberto", "Monogâmico", "Não monogâmico"].map((option) => {
                  const selected = filterDraftRelationship.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftRelationship((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                INTERESSES
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Gastronomia", "Moda", "Negócios", "Finanças", "Cinema", "Política", "Espiritualidade"].map((option) => {
                  const selected = filterDraftInterests.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftInterests((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                IDIOMAS
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Português", "Inglês", "Espanhol", "Francês", "Italiano", "Alemão", "Libras", "Outro"].map((option) => {
                  const selected = filterDraftLanguages.includes(option);

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setFilterDraftLanguages((current) =>
                          current.includes(option)
                            ? current.filter((item) => item !== option)
                            : [...current, option]
                        )
                      }
                      style={{
                        minHeight: "44px",
                        border: selected ? "1px solid #c9b58a" : "1px solid #292929",
                        background: selected ? "#15130f" : "#0b0b0b",
                        color: selected ? "#f4ead7" : "#c9b58a",
                        fontSize: "10px",
                        letterSpacing: "1px",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                POSIÇÃO
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                {["Ativo", "Passivo", "Versátil"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilterDraftPosition(filterDraftPosition === option ? "" : option)}
                    style={{
                      height: "44px",
                      border: filterDraftPosition === option ? "1px solid #c9b58a" : "1px solid #292929",
                      background: filterDraftPosition === option ? "#15130f" : "#0b0b0b",
                      color: filterDraftPosition === option ? "#f4ead7" : "#c9b58a",
                      fontSize: "10px",
                      letterSpacing: "1px",
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <p style={{ color: "#c9b58a", fontSize: "10px", letterSpacing: "2px", margin: "0 0 10px" }}>
                DISPONIBILIDADE
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                {["Agora", "Mais tarde", "Outro dia", "Conversar"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setFilterDraftAvailability(
                        filterDraftAvailability === option ? "" : option
                      )
                    }
                    style={{
                      height: "48px",
                      border:
                        filterDraftAvailability === option
                          ? "1px solid #c9b58a"
                          : "1px solid #292929",
                      background:
                        filterDraftAvailability === option
                          ? "#15130f"
                          : "#0b0b0b",
                      color:
                        filterDraftAvailability === option
                          ? "#f4ead7"
                          : "#c9b58a",
                      fontSize: "10px",
                      letterSpacing: "1px",
                      cursor: "pointer",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={applyFilters}
              style={{
                width: "100%",
                height: "48px",
                border: "1px solid #c9b58a",
                background: "#c9b58a",
                color: "#050505",
                fontSize: "10px",
                letterSpacing: "2.2px",
                cursor: "pointer",
              }}
            >
              APLICAR FILTROS
            </button>
          </div>
        </section>
      )}

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
              onClick={handleRefreshAll}
              disabled={locationLoading || discoveryLoading}
              title="Atualizar localização e Discovery"
              style={{
                minWidth: "112px",
                height: "34px",
                padding: "0 14px",
                border: "1px solid #292929",
                background: "#0b0b0b",
                color: "#c9b58a",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "1.5px",
                cursor: "pointer",
                opacity: (locationLoading || discoveryLoading) ? 0.55 : 1,
              }}
            >
              {(locationLoading || discoveryLoading) ? "ATUALIZANDO..." : "↻ ATUALIZAR"}
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={openFiltersPage}
              style={{
                minWidth: "150px",
                height: "38px",
                padding: "0 18px",
                border: "1px solid #c9b58a",
                background:
                  identityFilter ||
                  sexualityFilter ||
                  positionFilter ||
                  availabilityFilter ||
                  minAge !== 18 ||
                  maxAge !== 65
                    ? "#15130f"
                    : "#0b0b0b",
                color: "#c9b58a",
                fontSize: "9px",
                letterSpacing: "1.8px",
                cursor: "pointer",
              }}
            >
              {identityFilter ||
              sexualityFilter ||
              positionFilter ||
              availabilityFilter ||
              minAge !== 18 ||
              maxAge !== 65
                ? "FILTROS · ATIVOS"
                : "FILTROS"}
            </button>
          </div>

          <style>{`
            .moon-discovery-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 8px;
            }
            .moon-discovery-card-info {
              padding: 10px;
            }
            .moon-discovery-name {
              font-size: 13px !important;
              font-weight: 600 !important;
              letter-spacing: 0.5px !important;
            }
            .moon-discovery-distance {
              font-size: 9px !important;
              font-weight: 500 !important;
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
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 18px;
              }
              .moon-discovery-card-info {
                padding: 16px;
              }
              .moon-discovery-name {
                font-size: 18px !important;
                font-weight: 600 !important;
                letter-spacing: 1px !important;
              }
              .moon-discovery-distance {
                font-size: 11px !important;
                font-weight: 500 !important;
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
                  "repeat(3, minmax(0, 1fr))",
                gap:
                  "8px",
              }}
            >

              {nearbyProfiles
                .filter((profile) => {
                  const age = calculateAge(profile.birth_date);
                  const matchesAge = age >= minAge && age <= maxAge;

                  const matchesIdentity =
                    identityFilter.length === 0 ||
                    identityFilter.includes(profile.gender);

                  const matchesSexuality =
                    sexualityFilter.length === 0 ||
                    sexualityFilter.includes(profile.sexuality);

                  const matchesPosition =
                    positionFilter.length === 0 ||
                    positionFilter.includes(profile.position);

                  const matchesAvailability =
                    availabilityFilter.length === 0 ||
                    availabilityFilter.includes(profile.availability);

                  const matchesIntention =
                    filterDraftIntention.length === 0 ||
                    (Array.isArray(profile.intention) &&
                      filterDraftIntention.some((item) => profile.intention.includes(item)));

                  const matchesHabits =
                    filterDraftHabits.length === 0 ||
                    (Array.isArray(profile.habits) &&
                      filterDraftHabits.some((item) => profile.habits.includes(item)));

                  const matchesHobbies =
                    filterDraftHobbies.length === 0 ||
                    (Array.isArray(profile.hobbies) &&
                      filterDraftHobbies.some((item) => profile.hobbies.includes(item)));

                  const matchesPersonality =
                    filterDraftPersonality.length === 0 ||
                    (Array.isArray(profile.personality) &&
                      filterDraftPersonality.some((item) => profile.personality.includes(item)));

                  const matchesRelationship =
                    filterDraftRelationship.length === 0 ||
                    (Array.isArray(profile.relationship) &&
                      filterDraftRelationship.some((item) => profile.relationship.includes(item)));

                  const matchesInterests =
                    filterDraftInterests.length === 0 ||
                    (Array.isArray(profile.interests) &&
                      filterDraftInterests.some((item) => profile.interests.includes(item)));

                  const matchesLanguages =
                    filterDraftLanguages.length === 0 ||
                    (Array.isArray(profile.languages) &&
                      filterDraftLanguages.some((item) => profile.languages.includes(item)));

                  return (
                    matchesAge &&
                    matchesIdentity &&
                    matchesSexuality &&
                    matchesPosition &&
                    matchesAvailability &&
                    matchesIntention &&
                    matchesHabits &&
                    matchesHobbies &&
                    matchesPersonality &&
                    matchesRelationship &&
                    matchesInterests &&
                    matchesLanguages
                  );
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

                      </div>

                      {/* INFORMAÇÕES */}

                      <div
                        style={{
                          padding:
                            "10px",
                        }}
                      >

                        <h2
                          className="moon-discovery-name"
                          style={{
                            margin: "0 0 4px 0",
                            color: "#f4ead7",
                            fontSize: "17px",
                            fontWeight: "400",
                            letterSpacing: "1px",
                          }}
                        >
                          {(profile.name || "Sem nome").split(" ")[0]}
                        </h2>

                        {profile.birth_date && (
                          <div
                            style={{
                              color: "#c9b58a",
                              fontSize: "11px",
                              fontWeight: "500",
                              marginBottom: "5px",
                            }}
                          >
                            {calculateAge(profile.birth_date)} anos
                          </div>
                        )}

                        {status && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              color: status === "ATIVO AGORA" ? "#8fbd72" : "#8e877c",
                              fontSize: "8px",
                              letterSpacing: "1.5px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "8px",
                                lineHeight: "1",
                              }}
                            >
                              ●
                            </span>
                            <span>
                              {status}
                            </span>
                          </div>
                        )}

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
                  {reportDescription.startsWith("Denúncia contextual") ? "RELATAR MENSAGEM" : "DENUNCIAR PERFIL"}
                </p>

                <p
                  style={{
                    margin: "0 0 20px",
                    color: "#77736b",
                    fontSize: "11px",
                    lineHeight: "1.6",
                  }}
                >
                  {reportDescription.startsWith("Denúncia contextual")
                    ? "Conte pra gente o que aconteceu com essa mensagem."
                    : `Por que você quer denunciar ${reportTarget.name || "este perfil"}?`}
                </p>

                <div
                  style={{
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  {(reportDescription.startsWith("Denúncia contextual")
                    ? [
                        "Fui ofendido",
                        "Fui assediado",
                        "Fui humilhado",
                        "Recebi algo que não queria",
                        "Me senti ameaçado",
                        "Outro",
                      ]
                    : [
                        "Perfil falso",
                        "Conteúdo inadequado",
                        "Assédio ou comportamento abusivo",
                        "Spam ou publicidade",
                        "Outro motivo",
                      ]
                  ).map((reason) => (
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

          {!selectedProfile && (
            <>
                        {/* NAVEGAÇÃO INFERIOR */}
                        <div
                          style={{
                            position: "fixed",
                            left: "50%",
                            bottom: "14px",
                            transform: "translateX(-50%)",
                            width: "min(760px, calc(100vw - 20px))",
                            zIndex: 2000,
                            padding: "5px",
                            background: "rgba(8,8,8,0.95)",
                            border: "1px solid rgba(201,181,138,0.24)",
                            borderRadius: "18px",
                            backdropFilter: "blur(18px)",
                            boxShadow: "0 18px 50px rgba(0,0,0,0.62)",
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                              gap: "3px",
                            }}
                          >
                            {[
                              ["DISCOVERY", "inside"],
                              ["PERFIL", "profile"],
                              ["MAPA", "map"],
                              ["CURTIDAS", "likes"],
                              ["CONVERSAS", "conversations"],
                            ].map(([label, target]) => {
                              const active =
                                (target === "inside" && screen === "inside" && !selectedProfile) ||
                                (target === "profile" && screen === "profile") ||
                                (target === "map" && screen === "map") ||
                                (target === "likes" && screen === "likes") ||
                                (target === "conversations" && screen === "conversations");

                              return (
                                <button
                                  key={target}
                                  type="button"
                                  onClick={() => {
                                    setMessage("");
                                    if (target === "inside") {
                                      setSelectedProfile(null);
                                      setScreen("inside");
                                    } else if (target === "profile") {
                                      setSelectedProfile(null);
                                      setProfileEditMode(false);
                                      setScreen("profile");
                                    } else if (target === "map") {
                                      setSelectedProfile(null);
                                      setScreen("map");
                                    } else if (target === "likes") {
                                      handleOpenLikes();
                                    } else {
                                      handleOpenConversations();
                                    }
                                  }}
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                    minWidth: 0,
                                    height: "48px",
                                    border: active
                                      ? "1px solid rgba(201,181,138,0.5)"
                                      : "1px solid transparent",
                                    borderRadius: "14px",
                                    background: active
                                      ? "rgba(201,181,138,0.12)"
                                      : "transparent",
                                    color: active ? "#f4ead7" : "#8f897f",
                                    fontSize: "8px",
                                    fontWeight: active ? 700 : 600,
                                    letterSpacing: "1.35px",
                                    cursor: "pointer",
                                    transition: "all 0.28s ease",
                                    boxShadow: active
                                      ? "0 0 22px rgba(201,181,138,0.08)"
                                      : "none",
                                  }}
                                >
                                  <span>{label}</span>
                                  {target === "likes" && notificationCount.like > 0 && (
                                    <span style={{
                                      marginLeft: "5px",
                                      minWidth: "16px",
                                      height: "16px",
                                      padding: "0 4px",
                                      borderRadius: "999px",
                                      background: "#c9b58a",
                                      color: "#111",
                                      fontSize: "8px",
                                      fontWeight: 700,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}>
                                      {notificationCount.like > 99 ? "99+" : notificationCount.like}
                                    </span>
                                  )}
                                  {target === "conversations" && notificationCount.message > 0 && (
                                    <span style={{
                                      marginLeft: "5px",
                                      minWidth: "16px",
                                      height: "16px",
                                      padding: "0 4px",
                                      borderRadius: "999px",
                                      background: "#c9b58a",
                                      color: "#111",
                                      fontSize: "8px",
                                      fontWeight: 700,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}>
                                      {notificationCount.message > 99 ? "99+" : notificationCount.message}
                                    </span>
                                  )}
                                  {active && (
                                    <span
                                      style={{
                                        position: "absolute",
                                        left: "50%",
                                        bottom: "4px",
                                        width: "18px",
                                        height: "2px",
                                        borderRadius: "999px",
                                        transform: "translateX(-50%)",
                                        background: "#c9b58a",
                                        boxShadow: "0 0 10px rgba(201,181,138,0.45)",
                                      }}
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
            </>
          )}

        </section>
      )}

    </main>
  );
}

export default App;
