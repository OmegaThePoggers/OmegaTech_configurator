document.addEventListener("DOMContentLoaded", function () {
  // GSAP Animations
  gsap.from(".hero-section h1", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "power3.out",
  });
  gsap.from(".hero-section p", {
    duration: 1,
    y: -30,
    opacity: 0,
    delay: 0.5,
    ease: "power3.out",
  });
  gsap.from(".hero-section .btn", {
    duration: 1,
    y: 20,
    opacity: 0,
    delay: 1,
    ease: "bounce.out",
  });

  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card, index) => {
    gsap.from(card, {
      duration: 0.8,
      y: 50,
      opacity: 0,
      delay: 1.5 + index * 0.2,
      ease: "power3.out",
    });
  });

  const steps = document.querySelectorAll("#how-it-works .step");
  steps.forEach((step, index) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      duration: 0.8,
      x: -50,
      opacity: 0,
      delay: index * 0.3,
      ease: "power3.out",
    });
  });

  gsap.from("#how-it-works img", {
    scrollTrigger: {
      trigger: "#how-it-works img",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    duration: 1,
    scale: 0.8,
    opacity: 0,
    ease: "power3.out",
  });
});
