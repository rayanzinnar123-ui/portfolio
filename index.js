window.addEventListener('load', hidePreloader);

function hidePreloader() {
  const preloader = document.getElementById('preloader');
      preloader.style.display = 'none';
}




document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] Script loaded and DOM ready")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in")
        console.log("[v0] Animating element:", entry.target.className)
      }
    })
  }, observerOptions)

  // Observe all sections and cards
  document.querySelectorAll(".section, .skill-card, .project-card, .stat-card").forEach((el) => {
    observer.observe(el)
  })

  // Navbar background on scroll
  window.addEventListener("scroll", () => {
    const nav = document.querySelector(".nav")

    if (nav) {
      if (window.scrollY > 50) {
        nav.style.backgroundColor = "rgba(10, 14, 26, 0.95)"
        nav.style.backdropFilter = "blur(10px)"
      } else {
        nav.style.backgroundColor = "rgba(10, 14, 26, 0.9)"
      }
    }

    // Active nav link on scroll
    const scrollY = window.pageYOffset
    const sections = document.querySelectorAll("section[id]")

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - 100
      const sectionId = section.getAttribute("id")
      const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.style.color = "#94a3b8"
        })
        if (navLink) {
          navLink.style.color = "#3b82f6"
        }
      }
    })

    // Parallax effect on hero visual
    const heroVisual = document.querySelector(".hero-visual")
    if (heroVisual) {
      const scrolled = window.pageYOffset
      heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`
    }
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  const heroTitle = document.querySelector(".title")
  if (heroTitle) {
    console.log("[v0] Starting typing animation")
    const roles = ["16-Year-Old Developer", "Web Developer", "Problem Solver", "Creative Coder"]
    let roleIndex = 0
    let charIndex = 0
    let isDeleting = false

    function typeEffect() {
      const currentRole = roles[roleIndex]

      if (isDeleting) {
        heroTitle.textContent = currentRole.substring(0, charIndex - 1)
        charIndex--
      } else {
        heroTitle.textContent = currentRole.substring(0, charIndex + 1)
        charIndex++
      }

      let typeSpeed = isDeleting ? 50 : 100

      if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        roleIndex = (roleIndex + 1) % roles.length
        typeSpeed = 500
      }

      setTimeout(typeEffect, typeSpeed)
    }

    typeEffect()
  }

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector(".skill-progress")
          if (progressBar && !progressBar.classList.contains("animated")) {
            progressBar.classList.add("animated")
            const targetWidth = progressBar.style.width
            progressBar.style.width = "0%"
            setTimeout(() => {
              progressBar.style.width = targetWidth
              console.log("[v0] Animating skill bar to:", targetWidth)
            }, 200)
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  document.querySelectorAll(".skill-card").forEach((card) => {
    skillObserver.observe(card)
  })

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumber = entry.target.querySelector(".stat-number")
          if (statNumber && !statNumber.classList.contains("counted")) {
            statNumber.classList.add("counted")
            const text = statNumber.textContent
            const hasPlus = text.includes("+")
            const hasPercent = text.includes("%")
            const targetNumber = Number.parseInt(text.replace(/\D/g, ""))

            console.log("[v0] Starting count animation to:", targetNumber)

            if (!isNaN(targetNumber)) {
              let current = 0
              const increment = targetNumber / 40
              const duration = 1500
              const stepTime = duration / 40

              const timer = setInterval(() => {
                current += increment
                if (current >= targetNumber) {
                  statNumber.textContent = targetNumber + (hasPlus ? "+" : "") + (hasPercent ? "%" : "")
                  clearInterval(timer)
                } else {
                  statNumber.textContent = Math.floor(current) + (hasPlus ? "+" : "") + (hasPercent ? "%" : "")
                }
              }, stepTime)
            }
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  document.querySelectorAll(".stat-card").forEach((card) => {
    statsObserver.observe(card)
  })

  console.log("[v0] All animations initialized")

  { 
    // EmailJS setup & guarded form handling (runs after DOM is ready)
    if (!window.emailjs) {
      console.error("EmailJS SDK not loaded. Make sure the SDK <script> is before index.js")
    } else {
      emailjs.init("TjAKvXRGVdkQrQ2VE") // public key
    }

    const contactForm = document.getElementById("contactForm")
    if (!contactForm) {
      console.log("No contact form found on this page")
    } else {
      const formStatus = document.getElementById("formStatus")
      const submitBtn = contactForm.querySelector(".submit-btn")
      const btnText = submitBtn?.querySelector(".btn-text")
      const btnLoader = submitBtn?.querySelector(".btn-loader")

      contactForm.addEventListener("submit", function (e) {
        e.preventDefault()
        if (btnText && btnLoader && submitBtn) {
          btnText.style.display = "none"
          btnLoader.style.display = "inline"
          submitBtn.disabled = true
        }
        if (formStatus) {
          formStatus.textContent = ""
          formStatus.className = "form-status"
        }

        emailjs.sendForm("service_esqe2dc", "template_x6xdiqa", this)
          .then(() => {
            formStatus && (formStatus.textContent = "Message sent successfully! I'll get back to you soon.")
            formStatus && (formStatus.className = "form-status success")
            contactForm.reset()
            if (btnText && btnLoader && submitBtn) {
              btnText.style.display = "inline"
              btnLoader.style.display = "none"
              submitBtn.disabled = false
            }
          }, (error) => {
            formStatus && (formStatus.textContent = "Oops! Something went wrong. Please try again.")
            formStatus && (formStatus.className = "form-status error")
            if (btnText && btnLoader && submitBtn) {
              btnText.style.display = "inline"
              btnLoader.style.display = "none"
              submitBtn.disabled = false
            }
            console.error("EmailJS send error:", error)
          })
      })
    }
  }
})






