// Le Bon Débarras 66 11 - script simple (sans backend)
// Le formulaire prépare un message et l'ouvre selon l'appareil (tel / sms / whatsapp web).
// Remplace les valeurs ci-dessous par les tiennes.

const PHONE_E164 = "+33600000000"; // <- Remplace par ton numéro
const WHATSAPP_NUMBER = "33600000000"; // sans +, sans espaces

function encode(str) {
  return encodeURIComponent(str || "");
}

function buildMessage(data) {
  return `Bonjour, je souhaite un devis.

Nom : ${data.name}
Téléphone : ${data.phone}
Ville/CP : ${data.city}
Service : ${data.service}
Urgence : ${data.urgency}

Message :
${data.message}

Envoyé depuis lebondebarras6611.fr`;
}

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());
    const msg = buildMessage(data);

    // 1) WhatsApp (souvent le meilleur pour Ads)
    const waUrlMobile = `https://wa.me/${WHATSAPP_NUMBER}?text=${encode(msg)}`;
    const waUrlDesktop = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encode(msg)}`;

    // 2) SMS fallback
    const smsUrl = `sms:${PHONE_E164}?&body=${encode(msg)}`;

    // 3) Email fallback
    const mailUrl = `mailto:contact@lebondebarras6611.fr?subject=${encode("Demande de devis – Débarras/Transport 66/11")}&body=${encode(msg)}`;

    // Choix auto : mobile => WhatsApp mobile, desktop => WhatsApp web
    let target = isMobile() ? waUrlMobile : waUrlDesktop;

    // Si WhatsApp bloqué par navigateur, l'utilisateur pourra revenir et utiliser email/sms.
    window.open(target, "_blank", "noopener,noreferrer");

    // Petite info utilisateur
    alert("Votre demande est prête à envoyer sur WhatsApp. Si rien ne s'ouvre, utilisez l'appel direct ou envoyez par email.");
    
    // Option : reset formulaire
    // form.reset();
  });
});
