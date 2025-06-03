let orangeAnimationLock = false

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
	const confettiManager = new ConfettiManager()
	const pinataManager = new PinataManager(confettiManager)

	// Handle loading screen
	document.body.classList.add('no-scroll')
	const imgPromises = Array.from(document.images)
		.filter(img => !img.complete)
		.map(
			img =>
				new Promise(resolve => {
					img.onload = img.onerror = resolve
				})
		)

	const bgUrls = extractBackgroundUrls()
	const bgPromises = bgUrls.map(loadImage)
	const loadingScreen = document.getElementById('loading-screen')

	Promise.all([...imgPromises, ...bgPromises])
		.then(() => {
			clearInterval(loadingInterval)
			loadingPercentage = 100
			loadingElement.textContent = '100%'

			loadingScreen.style.animation = 'slideUp 0.5s forwards'
			container.style.animation = 'fadeInFocus 0.5s ease forwards'
			container.style.display = 'flex'
		})
		.catch(error => {
			console.error('Error during loading:', error)
			clearInterval(loadingInterval)
			loadingElement.textContent = '100%'
			loadingScreen.style.display = 'none'
			container.style.display = 'flex'
		})
		.finally(() => {
			document.body.classList.remove('no-scroll')
		})

	const el = document.getElementById('orange4')
	if (el) {
		let currentFrame = 0
		const peelFrames = [
			'media/peeling/peel1.avif',
			'media/peeling/peel2.avif',
			'media/peeling/peel3.avif',
			'media/peeling/peel4.avif',
		]

		const handlePeelClick = () => {
			if (currentFrame < peelFrames.length) {
				const img = el.querySelector('img')
				img.src = peelFrames[currentFrame]
				currentFrame++
			}
		}

		el.addEventListener('click', e => {
			e.preventDefault()
			handlePeelClick()
		})

		el.addEventListener(
			'touchstart',
			e => {
				handlePeelClick()
			},
			{ passive: true }
		)
	}

	const orange5 = document.getElementById('orange5')
	if (orange5) {
		const img5 = orange5.querySelector('img')
		let orange5Clicked = false

		const handleClick = () => {
			if (orange5Clicked) return

			orange5Clicked = true
			img5.src = 'media/hedgehog/hedgehog.gif'
			void img5.offsetHeight
			img5.style.width = '140%'
			img5.style.transform = 'translateX(-30%)'
			img5.style.height = 'auto'

			setTimeout(() => {
				img5.src = 'media/orange.avif'
				orange5Clicked = false
				img5.style.width = '100%'
				img5.style.height = 'auto'
				img5.style.transform = 'translateX(0%)'
			}, 760)
		}

		orange5.addEventListener('click', e => {
			e.preventDefault()
			handleClick()
		})

		orange5.addEventListener(
			'touchstart',
			e => {
				handleClick()
			},
			{ passive: true }
		)
	}

	const el6 = document.getElementById('orange6')
	const oldOrange = el6.querySelector('.old-orange')
	const newOrange = el6.querySelector('.new-orange')

	let isAnimating = false

	const triggerAnimation = () => {
		if (isAnimating) return
		isAnimating = true

		oldOrange.style.animation = 'none'
		newOrange.style.animation = 'none'
		el6.offsetHeight // reflow
		oldOrange.style.animation = ''
		newOrange.style.animation = ''

		el6.classList.add('clicked')

		setTimeout(() => {
			oldOrange.style.opacity = '1'
			newOrange.style.opacity = '0'
			el6.classList.remove('clicked')
			isAnimating = false
		}, 2000)
	}

	const handleClickOrTouch = e => {
		e.preventDefault()
		triggerAnimation()
	}

	el6.addEventListener('click', handleClickOrTouch)
	el6.addEventListener('touchstart', handleClickOrTouch, { passive: false })

	const helpButton = document.getElementById('help-button')
	if (helpButton) {
		helpButton.addEventListener('click', () => {
			const donateOffer = document.querySelector('.donate_offer')
			if (donateOffer) {
				donateOffer.scrollIntoView({ behavior: 'smooth', block: 'start' })
			}
		})
	} else {
		console.error('Help button not found')
	}

	const audio = document.getElementById('background-audio')
	const audioToggle = document.getElementById('audio-toggle')

	audioToggle.addEventListener('click', () => {
		if (audio.paused) {
			audio.play()
		} else {
			audio.pause()
		}
	})

	document.querySelectorAll('.team-help-button').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.orange-modal.active').forEach(modal => {
				modal.classList.remove('active')
			})

			setTimeout(() => {
				const donateOffer = document.querySelector('.donate_offer')
				if (donateOffer) {
					donateOffer.scrollIntoView({ behavior: 'smooth', block: 'start' })
				}
			}, 200)
		})
	})

	document.querySelectorAll('.team-help-button-more').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.orange-modal.active').forEach(modal => {
				modal.classList.remove('active')
			})

			document.getElementById('close-orange1-modal-more').click()
			document.body.classList.remove('no-scroll')

			setTimeout(() => {
				const donateOffer = document.querySelector('.donate_offer')
				if (donateOffer) {
					donateOffer.scrollIntoView({ behavior: 'smooth', block: 'start' })
				}
			}, 200)
		})
	})

	const pairs = [
		{
			trigger: '.caterpillar',
			modal: '.caterpillar-modal',
			imgSelector: 'img',
			defaultImg: 'media/caterpillar.avif',
			hoverImg: 'media/caterpillar_hover.avif',
			clickImg: 'media/caterpillar_hover.avif',
		},
		{
			trigger: '.bird',
			modal: '.bird-modal',
			imgSelector: 'img',
			defaultImg: 'media/bird.avif',
			hoverImg: 'media/bird_hover.avif',
			clickImg: 'media/bird_hover.avif',
		},
	]

	pairs.forEach(
		({ trigger, modal, imgSelector, defaultImg, hoverImg, clickImg }) => {
			const triggerEl = document.querySelector(trigger)
			const modalEl = document.querySelector(modal)
			const imgEl = triggerEl?.querySelector(imgSelector)

			if (!triggerEl || !modalEl || !imgEl) return

			let isTouchDevice =
				'ontouchstart' in window || navigator.maxTouchPoints > 0
			let isOver = false

			const showModal = () => {
				modalEl.style.display = 'block'
				modalEl.style.animation = 'fadeInFocus 0.5s ease forwards'
				triggerEl.style.zIndex = '1000'
			}
			const hideModal = () => {
				modalEl.style.display = 'none'
				triggerEl.style.zIndex = '1'
			}
			const checkHide = () => {
				if (!isOver) hideModal()
			}

			const enterHandler = () => {
				isOver = true
				showModal()
				imgEl.src = hoverImg
			}
			const leaveHandler = () => {
				isOver = false
				setTimeout(checkHide, 100)
				imgEl.src = defaultImg
			}

			let resetImgTimeout

			if (isTouchDevice) {
				triggerEl.addEventListener('click', e => {
					e.stopPropagation()
					showModal()
					imgEl.src = clickImg

					clearTimeout(resetImgTimeout)

					resetImgTimeout = setTimeout(() => {
						imgEl.src = defaultImg
					}, 200)
				})

				modalEl.addEventListener('click', e => e.stopPropagation())
				document.addEventListener('click', () => {
					hideModal()
					clearTimeout(resetImgTimeout)
					imgEl.src = defaultImg
				})
			} else {
				triggerEl.addEventListener('mouseenter', enterHandler)
				triggerEl.addEventListener('mouseleave', leaveHandler)
				modalEl.addEventListener('mouseenter', enterHandler)
				modalEl.addEventListener('mouseleave', leaveHandler)

				triggerEl.addEventListener('click', e => {
					e.stopPropagation()
					modalEl.style.display =
						modalEl.style.display === 'block' ? 'none' : 'block'
					imgEl.src = clickImg
					setTimeout(() => {
						imgEl.src = hoverImg
					}, 200)
				})
			}
		}
	)
})

// Confetti
function randomBetween(a, b) {
	return a + Math.random() * (b - a)
}

let allConfetti = []
let animationFrameId = null

function animateConfetti() {
	const canvas = document.getElementById('confetti')
	const ctx = canvas.getContext('2d')

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// Draw all confetti
	allConfetti = allConfetti.filter(c => {
		ctx.save()
		ctx.translate(c.x, c.y)
		ctx.rotate(c.rotation)
		ctx.drawImage(c.image, -c.size / 2, -c.size / 2, c.size, c.size)
		ctx.restore()

		c.x += c.dx
		c.y += c.dy
		c.dy += c.gravity
		c.rotation += c.rotationSpeed

		return c.y < canvas.height + 100
	})

	if (allConfetti.length > 0) {
		animationFrameId = requestAnimationFrame(animateConfetti)
	} else {
		cancelAnimationFrame(animationFrameId)
		animationFrameId = null
	}
}

function launchConfetti() {
	const canvas = document.getElementById('confetti')
	const ctx = canvas.getContext('2d')

	const pinataArea = document.querySelector('.pinata-area')
	canvas.width = pinataArea.offsetWidth * 5
	canvas.height = pinataArea.offsetHeight * 5

	const pinataRect = pinata.getBoundingClientRect()
	const canvasRect = canvas.getBoundingClientRect()
	const pinataCenterX = pinataRect.left - canvasRect.left + pinataRect.width / 2
	const pinataCenterY = pinataRect.top - canvasRect.top + pinataRect.height / 2

	console.log(pinataCenterX, pinataCenterY)

	const confettiImages = []
	for (let i = 1; i <= 7; i++) {
		const img = new Image()
		img.src = `media/confetti/confetti ${i.toString().padStart(2, '0')}.png`
		confettiImages.push(img)
	}

	const baseConfettiCount = 8
	const additionalConfetti = clickCount * 2
	const confettiCount = baseConfettiCount + additionalConfetti

	for (let i = 0; i < confettiCount; i++) {
		allConfetti.push({
			x: pinataCenterX,
			y: pinataCenterY,
			size: randomBetween(30, 50),
			angle: randomBetween(0, 2 * Math.PI),
			speed: randomBetween(1, 3),
			dx: randomBetween(-3, 3),
			dy: randomBetween(-5, -3),
			gravity: randomBetween(0.05, 0.1),
			rotation: randomBetween(0, 2 * Math.PI),
			rotationSpeed: randomBetween(-0.1, 0.1),
			image: confettiImages[Math.floor(Math.random() * confettiImages.length)],
		})
	}

	if (!animationFrameId) {
		animateConfetti()
	}
}

// Pinata
const pinata = document.getElementById('pinata')
let clickCount = 0
let popupShown = false
let returnTimeout = null
let currentAngle = 0

const pinataImages = {
	default: new Image(),
	hover: new Image(),
}
pinataImages.default.src = 'media/pinata/pinata.png'
pinataImages.hover.src = 'media/pinata/pinata-hover.png'

function handlePinataInteraction(e) {
	pinata.src = pinataImages.hover.src

	const currentRotation = getCurrentRotation(pinata)
	const pinataRect = pinata.getBoundingClientRect()

	const interactionX = e.type.startsWith('touch')
		? e.touches[0].clientX
		: e.clientX
	const pinataCenterX = pinataRect.left + pinataRect.width / 2

	pinata.style.setProperty('--current-rotation', `${currentRotation}deg`)
	pinata.classList.remove('pinata-shake-left', 'pinata-shake-right')
	void pinata.offsetWidth // Force reflow

	if (interactionX > pinataCenterX) {
		pinata.classList.add('pinata-shake-right')
	} else {
		pinata.classList.add('pinata-shake-left')
	}
}

function resetPinata() {
	pinata.src = pinataImages.default.src
	pinata.classList.remove('pinata-shake-left', 'pinata-shake-right')
}

// Update pinata event listeners
if (pinata) {
	pinata.src = pinataImages.default.src
	pinata.addEventListener('mouseenter', handlePinataInteraction)
	pinata.addEventListener('mouseleave', resetPinata)

	pinata.addEventListener('touchstart', handlePinataInteraction)
	pinata.addEventListener('touchend', resetPinata)
	pinata.addEventListener('click', () => {
		if (popupShown) return

		clearTimeout(returnTimeout)

		currentAngle = getCurrentRotation(pinata)

		pinata.style.setProperty('--start-rotation', `${currentAngle}deg`)

		pinata.classList.remove(
			'swing-1',
			'swing-2',
			'swing-3',
			'swing-4',
			'swing-5',
			'return-to-center'
		)
		void pinata.offsetWidth // Force reflow

		const swingClass = `swing-${Math.min(clickCount + 1, 5)}`
		pinata.classList.add(swingClass)

		returnTimeout = setTimeout(() => {
			currentAngle = getCurrentRotation(pinata)
			pinata.style.setProperty('--start-rotation', `${currentAngle}deg`)

			pinata.classList.remove(
				'swing-1',
				'swing-2',
				'swing-3',
				'swing-4',
				'swing-5'
			)
			void pinata.offsetWidth // Force reflow
			pinata.classList.add('return-to-center')
		}, 400)

		launchConfetti()
		clickCount++

		if (clickCount === 1) {
			const hintElement = document.createElement('div')
			hintElement.textContent = 'Привет, я даю подарки!'
			hintElement.style.position = 'absolute'
			hintElement.style.top = '45%'
			hintElement.style.left = '25%'
			hintElement.style.transform = 'translateX(-25%)'
			hintElement.style.backgroundImage = 'url("media/hint-window.png")'
			hintElement.style.backgroundSize = 'contain'
			hintElement.style.backgroundRepeat = 'no-repeat'
			hintElement.style.backgroundPosition = 'center'
			hintElement.style.backgroundSize = '100% 100%'
			hintElement.style.color = '#2E2C24'
			hintElement.style.padding = '10px'
			hintElement.style.borderRadius = '5px'
			hintElement.style.zIndex = '1000'
			document.body.appendChild(hintElement)
			setTimeout(() => {
				document.body.removeChild(hintElement)
			}, 3000)
		}

		if (clickCount >= Math.floor(Math.random() * 3) + 3) {
			showPopup()
		}
	})
}

// Promo codes
const promoCodes = [
	{
		company:
			'<img src="media/promo_logos/ingos.png" alt="Ингосстрах" class="promo-logo">',
		code: 'УВЕРЕННОСТЬ',
		desc: 'Промокод 10%  действует на все страховые полисы для путешествий, кроме годового полиса. Активируйте промокод в приложении IngoMobile или на сайте Иногостраха до 13.07.2025',
	},
	{
		company:
			'<img src="media/promo_logos/yasno.png" alt="ЯСНО" class="promo-logo">',
		code: 'ONCOLOGIKA-YASNO',
		desc: 'Скидка 15% на первые 3 сессии при регистрации. Промокод на 1 сессию нужно применить до 13.07.2025',
	},
	{
		company:
			'<img src="media/promo_logos/litres.png" alt="ЛитРес" class="promo-logo">',
		code: 'oncologica2025',
		desc: 'Промокод предоставляет возможность скачать одну электронную или аудиокнигу из подборки на выбор в подарок. Одновременно промокод предоставляет скидку 20% на основной каталог Литрес. Скидка действует 3 дня с момента активации на одну покупку и неограниченное количество книг в корзине. Скидка не распространяется на Литрес: Подписку и Литрес: Абонемент. Скидка не суммируется с другими акциями. Скидка не распространяется на часть книг, определяемых Литрес самостоятельно в одностороннем порядке. Активировать промокод можно до 31.08.2025г',
	},
	{
		company:
			'<img src="media/promo_logos/flowwow.png" alt="FLOWWOW" class="promo-logo">',
		code: 'oncologicafw13',
		desc: 'Промокод на скидку 15% действует до 31.08.2025 на первую или повторную покупку на сайте или в мобильном приложении Flowwow. Во время оформления заказа введите промокод в специальное поле – сумма заказа обновится автоматически.',
	},
]

function getRandomPromoCode() {
	const randomIndex = Math.floor(Math.random() * promoCodes.length)
	return promoCodes[randomIndex]
}

function showPopup() {
	popupShown = true
	const promo = getRandomPromoCode()
	const promoElement = document.createElement('div')
	promoElement.classList.add('promo-wrapper')

	promoElement.innerHTML = `
		<span class="promo-code">
			${promo.code}
			<img src="media/icons/icon_copy.avif" alt="Copy" class="copy-icon">
		</span>
		<p class="promo-brand-before">Промокод от</p>
		<div class="promo-brand">${promo.company}</div>
		<p class="promo-desc">${promo.desc}</p>
	`

	promoElement.querySelector('.promo-code').addEventListener('click', () => {
		navigator.clipboard.writeText(promo.code).then(() => {
			alert('Промокод скопирован в буфер обмена!')
		})
	})

	const popup = document.getElementById('popup-backdrop')
	const promoContainer = popup.querySelector('p')
	promoContainer.innerHTML = ''
	promoContainer.appendChild(promoElement)
	popup.style.display = 'flex'
}

document
	.getElementById('close-popup-btn')
	.addEventListener('click', function () {
		const popup = document.getElementById('popup-backdrop')
		popup.style.display = 'none'
		popupShown = false
		clickCount = 0
		allConfetti = [] // Очистка конфетти

		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId)
			animationFrameId = null
		}

		// Перезапуск конфетти (если нужно)
		const confettiManager = new ConfettiManager()
		confettiManager.clear()
		confettiManager.animate()
	})

class PinataManager {
	constructor(confettiManager) {
		this.pinata = document.getElementById('pinata')
		this.confettiManager = confettiManager
		this.clickCount = 0
		this.popupShown = false
		this.returnTimeout = null
		this.currentAngle = 0
		this.breakThreshold = this.getRandomBreakThreshold()

		this.PINATA_IMAGES = {
			default: 'media/pinata/pinata.png',
			hover: 'media/pinata/pinata-hover.png',
		}

		this.initEventListeners()
	}

	getRandomBreakThreshold() {
		return Math.floor(Math.random() * 3) + 3
	}

	initEventListeners() {
		this.pinata.addEventListener('mouseenter', this.handleMouseEnter.bind(this))
		this.pinata.addEventListener('mouseleave', this.handleMouseLeave.bind(this))
		this.pinata.addEventListener('click', this.handleClick.bind(this))
	}

	handleMouseEnter(e) {
		this.pinata.src = this.PINATA_IMAGES.hover
		const currentRotation = getCurrentRotation(this.pinata)
		const pinataRect = this.pinata.getBoundingClientRect()
		const mouseX = e.clientX
		const pinataCenterX = pinataRect.left + pinataRect.width / 2

		this.pinata.style.setProperty('--current-rotation', `${currentRotation}deg`)
		this.pinata.classList.remove('pinata-shake-left', 'pinata-shake-right')
		void this.pinata.offsetWidth

		if (mouseX > pinataCenterX) {
			this.pinata.classList.add('pinata-shake-right')
		} else {
			this.pinata.classList.add('pinata-shake-left')
		}
	}

	handleMouseLeave() {
		this.pinata.src = this.PINATA_IMAGES.default
	}

	handleClick() {
		if (this.popupShown) return

		clearTimeout(this.returnTimeout)
		this.currentAngle = getCurrentRotation(this.pinata)
		this.pinata.style.setProperty('--start-rotation', `${this.currentAngle}deg`)

		this.removeAllSwingClasses()
		const swingClass = `swing-${Math.min(this.clickCount + 1, 5)}`
		this.pinata.classList.add(swingClass)

		this.returnTimeout = setTimeout(() => {
			this.currentAngle = getCurrentRotation(this.pinata)
			this.pinata.style.setProperty(
				'--start-rotation',
				`${this.currentAngle}deg`
			)
			this.removeAllSwingClasses()
			this.pinata.classList.add('return-to-center')
		}, 400)

		this.confettiManager.launch(this.clickCount)
		this.clickCount++

		if (this.clickCount >= this.breakThreshold) {
			this.confettiManager.clear()
		}
	}

	removeAllSwingClasses() {
		this.pinata.classList.remove(
			'swing-1',
			'swing-2',
			'swing-3',
			'swing-4',
			'swing-5',
			'return-to-center'
		)
		void this.pinata.offsetWidth
	}
}

class ConfettiManager {
	constructor() {
		this.canvas = document.getElementById('confetti')
		this.ctx = this.canvas.getContext('2d')
		this.confetti = []
		this.animationFrameId = null
		this.confettiImages = []
		this.initConfettiImages()
	}

	initConfettiImages() {
		for (let i = 1; i <= 7; i++) {
			const img = new Image()
			img.src = `media/confetti/confetti ${i.toString().padStart(2, '0')}.png`
			this.confettiImages.push(img)
		}
	}

	animate() {
		if (this.animationFrameId) return // Prevent multiple animation loops

		this.animationFrameId = requestAnimationFrame(() => this.animateLoop())
	}

	animateLoop() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		this.confetti = this.confetti.filter(c => {
			this.ctx.save()
			this.ctx.translate(c.x, c.y)
			this.ctx.rotate(c.rotation)
			this.ctx.drawImage(c.image, -c.size / 2, -c.size / 2, c.size, c.size)
			this.ctx.restore()

			c.x += c.dx
			c.y += c.dy
			c.dy += c.gravity
			c.rotation += c.rotationSpeed

			return c.y < this.canvas.height + 100
		})

		if (this.confetti.length > 0) {
			this.animationFrameId = requestAnimationFrame(() => this.animateLoop())
		} else {
			cancelAnimationFrame(this.animationFrameId)
			this.animationFrameId = null
		}
	}

	launch(clickCount) {
		const pinata = document.getElementById('pinata')
		const canvas = this.canvas

		const pinataRect = pinata.getBoundingClientRect()
		const canvasRect = canvas.getBoundingClientRect()

		const pinataCenterX =
			pinataRect.left - canvasRect.left + pinataRect.width / 2
		const pinataCenterY =
			pinataRect.top - canvasRect.top + pinataRect.height / 2

		const baseConfettiCount = 8
		const additionalConfetti = clickCount * 2
		const confettiCount = Math.min(baseConfettiCount + additionalConfetti, 12)

		for (let i = 0; i < confettiCount; i++) {
			this.confetti.push({
				x: pinataCenterX,
				y: pinataCenterY,
				size: randomBetween(20, 40),
				angle: randomBetween(0, 2 * Math.PI),
				speed: randomBetween(1, 3),
				dx: randomBetween(-2, 2),
				dy: randomBetween(-4, -2),
				gravity: randomBetween(0.05, 0.1),
				rotation: randomBetween(0, 2 * Math.PI),
				rotationSpeed: randomBetween(-0.1, 0.1),
				image:
					this.confettiImages[
						Math.floor(Math.random() * this.confettiImages.length)
					],
			})
		}

		this.animate()
	}

	clear() {
		this.confetti = []
		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId)
			this.animationFrameId = null
		}
	}
}

// Loading screen
let loadingPercentage = 0
const loadingElement = document.getElementById('loading-percentage')
const container = document.querySelector('.container')

const loadingInterval = setInterval(() => {
	if (loadingPercentage < 99) {
		loadingPercentage += 1
		loadingElement.textContent = `${loadingPercentage}%`
	}
}, 50)

function loadImage(url) {
	return new Promise(resolve => {
		const img = new Image()
		img.onload = img.onerror = resolve
		img.src = url
	})
}

function extractBackgroundUrls() {
	const urls = new Set()

	document.querySelectorAll('*').forEach(el => {
		const style = getComputedStyle(el)
		const bg = style.getPropertyValue('background-image')

		if (bg && bg !== 'none') {
			const matches = [...bg.matchAll(/url\(["']?(.*?)["']?\)/g)]
			matches.forEach(match => {
				if (match[1]) {
					urls.add(match[1])
				}
			})
		}
	})

	return Array.from(urls)
}

window.addEventListener('load', () => {
	const loadingScreen = document.getElementById('loading-screen')
	const container = document.querySelector('.container')

	// Update loading percentage
	let loadingPercentage = 0
	const loadingInterval = setInterval(() => {
		if (loadingPercentage < 100) {
			loadingPercentage += 1
			document.getElementById(
				'loading-percentage'
			).textContent = `${loadingPercentage}%`
		} else {
			clearInterval(loadingInterval)
			loadingScreen.style.display = 'none'
			container.style.display = 'flex'
		}
	}, 80)
})

document.getElementById('call-button').addEventListener('click', () => {
	if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
		window.location.href = 'tel:88003505785'
	} else {
		navigator.clipboard.writeText('88003505785').then(() => {
			alert('Номер телефона скопирован в буфер обмена!')
		})
	}
})

document.getElementById('open-cards-button').addEventListener('click', () => {
	document.getElementById('card-selection').style.display = 'flex'
})

document
	.getElementById('close-card-selection')
	.addEventListener('click', () => {
		document.getElementById('card-selection').style.display = 'none'
	})

document.querySelectorAll('.download-button').forEach(button => {
	button.addEventListener('click', event => {
		const cardFileName = event.target.getAttribute('data-card')
		const link = document.createElement('a')
		link.href = `media/cards/${cardFileName}`
		link.download = cardFileName
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	})
})

let selectedCard = null

document.querySelectorAll('.card').forEach(card => {
	card.addEventListener('click', () => {
		document
			.querySelectorAll('.card')
			.forEach(c => c.classList.remove('selected'))

		card.classList.add('selected')

		document.getElementById('download-selected-card').disabled = false

		selectedCard = card.getAttribute('data-card')
	})
})

document
	.getElementById('download-selected-card')
	.addEventListener('click', async () => {
		if (!selectedCard) return

		try {
			const response = await fetch(`media/cards/${selectedCard}`)
			const svgText = await response.text()

			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')

			const img = new Image()
			img.src =
				'data:image/svg+xml;base64,' +
				btoa(unescape(encodeURIComponent(svgText)))

			await new Promise(resolve => {
				img.onload = resolve
				img.onerror = () => {
					console.error('Error loading card')
					resolve()
				}
			})

			canvas.width = img.width
			canvas.height = img.height

			ctx.drawImage(img, 0, 0)

			const link = document.createElement('a')
			link.download = selectedCard
			link.href = canvas.toDataURL('image/png')

			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			console.error('Error converting SVG to PNG:', error)
			const link = document.createElement('a')
			link.href = `media/cards/${selectedCard}`
			link.download = selectedCard
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	})

// Debounce function to limit how often a function is called
function debounce(func, wait) {
	let timeout
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func.apply(this, args), wait)
	}
}

function checkOrientation() {
	const isPortrait = window.matchMedia('(orientation: portrait)').matches
	const orientationPrompt = document.getElementById('orientation-prompt')

	if (isPortrait) {
		orientationPrompt.style.display = 'block'
	} else {
		orientationPrompt.style.display = 'none'
	}
}

document.addEventListener('DOMContentLoaded', () => {
	setTimeout(checkOrientation, 10)
})

window.addEventListener('orientationchange', debounce(checkOrientation, 200))

function getCurrentRotation(element) {
	const rotation = getComputedStyle(element).transform
	if (rotation !== 'none') {
		const values = rotation.split('(')[1].split(')')[0].split(',')
		const a = parseFloat(values[0])
		const b = parseFloat(values[1])
		return Math.round(Math.atan2(b, a) * (180 / Math.PI))
	}
	return 0
}

document.querySelectorAll('.orange').forEach(orange => {
	const modalId = orange.getAttribute('data-modal')
	const modal = document.getElementById(modalId)

	if (modal) {
		let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
		const isDisabledModal = [
			'orange2-modal',
			'orange7-modal',
			'orange8-modal',
		].includes(modalId)

		if (isTouchDevice) {
			orange.addEventListener('click', () => {
				modal.classList.toggle('active')

				$('.container').css('animation', 'none')
				grayAllExcept(orange)
				orangeAnimationLock = true
			})
		} else {
			if (!isDisabledModal) {
				const showModal = () => {
					modal.classList.add('active')

					$('.container').css('animation', 'none')
					grayAllExcept(orange)
					orangeAnimationLock = true
				}
				const hideModal = () => {
					modal.classList.remove('active')

					orangeAnimationLock = false
					clearGray()
				}

				let isOver = false
				const checkHide = () => {
					if (!isOver) hideModal()
				}

				const enterHandler = () => {
					isOver = true
					showModal()
				}
				const leaveHandler = () => {
					isOver = false
					setTimeout(checkHide, 100)
				}

				orange.addEventListener('mouseenter', enterHandler)
				orange.addEventListener('mouseleave', leaveHandler)
				modal.addEventListener('mouseenter', enterHandler)
				modal.addEventListener('mouseleave', leaveHandler)
			} else {
				let tooltipText = ''

				if (modalId === 'orange2-modal') tooltipText = 'О фонде'
				else if (modalId === 'orange7-modal') tooltipText = 'Раскраска'
				else if (modalId === 'orange8-modal') tooltipText = 'Колесо добрых дел'

				if (tooltipText) {
					orange.setAttribute('data-tooltip', tooltipText)
				}
			}

			orange.addEventListener('click', () => {
				modal.classList.toggle('active')
			})
		}
	}
})

document.querySelectorAll('.close-modal').forEach(button => {
	button.addEventListener('click', function () {
		const modal = this.closest('.orange-modal')
		if (modal) {
			modal.classList.remove('active')
		}
	})
})

document.getElementById('learn-more').addEventListener('click', () => {
	document.getElementById('orange1-modal-more').style.display = 'flex'
	document.body.classList.add('no-scroll')
})

document
	.getElementById('close-orange1-modal-more')
	.addEventListener('click', () => {
		document.getElementById('orange1-modal-more').style.display = 'none'
		document.body.classList.remove('no-scroll')
	})

// Game 1: Paint
;(function () {
	const canvas = document.getElementById('orangeCanvas')
	const ctx = canvas.getContext('2d')
	const saveBtn = document.getElementById('saveDrawing')

	const centerX = canvas.width / 2
	const centerY = canvas.height / 2
	const radius = Math.min(canvas.width, canvas.height) / 2

	let drawing = false
	let currentColor = '#ff5100'
	let hasDrawn = false

	const orangeImg = new Image()
	orangeImg.src = 'media/paint_game/paint_orange.avif'

	const overlayCanvas = document.getElementById('orangeOverlay')
	const overlayCtx = overlayCanvas.getContext('2d')

	orangeImg.onload = () => {
		overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)
		overlayCtx.drawImage(
			orangeImg,
			centerX - radius,
			centerY - radius,
			radius * 2,
			radius * 2
		)
	}

	document.querySelectorAll('.color-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.color-btn').forEach(b => {
				b.classList.remove('active')
			})

			btn.classList.add('active')

			currentColor = btn.getAttribute('data-color')
		})
	})

	// Mouse events
	canvas.addEventListener('mousedown', () => (drawing = true))
	canvas.addEventListener('mouseup', () => (drawing = false))
	canvas.addEventListener('mouseleave', () => (drawing = false))

	// Touch events - prevent default to stop scrolling
	canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
	canvas.addEventListener('touchend', handleTouchEnd, { passive: false })
	canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

	function handleTouchStart(e) {
		e.preventDefault()
		drawing = true
		const pos = getTouchPos(e)
		handleDraw(pos)
	}

	function handleTouchEnd(e) {
		e.preventDefault()
		drawing = false
	}

	function handleTouchMove(e) {
		if (!drawing) return
		e.preventDefault()
		const pos = getTouchPos(e)
		handleDraw(pos)
	}

	function getTouchPos(e) {
		const rect = canvas.getBoundingClientRect()
		scaleX = canvas.width / rect.width
		scaleY = canvas.height / rect.height
		return {
			x: (e.touches[0].clientX - rect.left) * scaleX,
			y: (e.touches[0].clientY - rect.top) * scaleY,
		}
	}

	function handleDraw(pos) {
		const x = pos.x
		const y = pos.y

		const dx = x - centerX
		const dy = y - centerY
		if (dx * dx + dy * dy <= radius * radius) {
			ctx.fillStyle = currentColor
			ctx.beginPath()
			ctx.arc(x, y, 5, 0, Math.PI * 2)
			ctx.fill()
			if (!hasDrawn) {
				hasDrawn = true
				saveBtn.classList.add('active')
			}
		}
	}

	canvas.addEventListener('mousemove', e => {
		if (!drawing) return

		const rect = canvas.getBoundingClientRect()
		scaleX = canvas.width / rect.width
		scaleY = canvas.height / rect.height
		const x = (e.clientX - rect.left) * scaleX
		const y = (e.clientY - rect.top) * scaleY
		handleDraw({ x, y })
	})

	window.saveDrawing = function () {
		const FIGMA = {
			bgWidth: 506,
			bgHeight: 655,
			drawX: 133,
			drawY: 212,
			drawWidth: 241,
			drawHeight: 248,
		}

		const sourceCanvas = document.getElementById('orangeCanvas')
		const overlayCanvas = document.getElementById('orangeOverlay')
		const tempCanvas = document.createElement('canvas')
		const tempCtx = tempCanvas.getContext('2d')

		tempCanvas.width = FIGMA.bgWidth
		tempCanvas.height = FIGMA.bgHeight

		const bgImage = new Image()
		bgImage.crossOrigin = 'anonymous'
		bgImage.src = 'media/paint_game/paper.avif'

		bgImage.onload = function () {
			tempCtx.drawImage(bgImage, 0, 0, FIGMA.bgWidth, FIGMA.bgHeight)

			const sourceRatio = sourceCanvas.width / sourceCanvas.height
			const targetRatio = FIGMA.drawWidth / FIGMA.drawHeight

			let scale,
				offsetX = 0,
				offsetY = 0

			if (sourceRatio > targetRatio) {
				scale = FIGMA.drawHeight / sourceCanvas.height
				offsetX = (FIGMA.drawWidth - sourceCanvas.width * scale) / 2
			} else {
				scale = FIGMA.drawWidth / sourceCanvas.width
				offsetY = (FIGMA.drawHeight - sourceCanvas.height * scale) / 2
			}

			tempCtx.save()
			tempCtx.translate(FIGMA.drawX, FIGMA.drawY)
			tempCtx.translate(offsetX, offsetY)
			tempCtx.scale(scale, scale)
			tempCtx.drawImage(sourceCanvas, 0, 0)
			tempCtx.drawImage(overlayCanvas, 0, 0)
			tempCtx.restore()

			const textX = 137 + 233 / 2
			const textY = 56 + 40

			tempCtx.font = '40px Normalidad, sans-serif'
			tempCtx.textAlign = 'center'
			tempCtx.textBaseline = 'top'
			tempCtx.lineWidth = 5
			tempCtx.strokeStyle = '#EBE1C8'
			tempCtx.fillStyle = '#2E2C24'

			const lines = ['Мой', 'апельсин!']
			lines.forEach((line, i) => {
				const y = textY + i * 44
				tempCtx.strokeText(line, textX, y)
				tempCtx.fillText(line, textX, y)
			})

			const logo = new Image()
			logo.src = 'media/paint_game/logo_after_game.png'
			logo.onload = function () {
				const logoWidth = 325
				const logoHeight = 40
				const logoX = 92
				const logoY = 535

				tempCtx.drawImage(logo, logoX, logoY, logoWidth, logoHeight)

				const link = document.createElement('a')
				link.download = 'Мой апельсин.png'
				link.href = tempCanvas.toDataURL('image/png')
				if (hasDrawn) {
					link.click()
				}
			}
		}

		bgImage.onerror = function () {
			const link = document.createElement('a')
			link.download = 'Мой апельсин.png'
			link.href = sourceCanvas.toDataURL('image/png')
			if (hasDrawn) {
				link.click()
			}
		}
	}

	window.clearCanvas = function () {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		hasDrawn = false
		saveBtn.classList.remove('active')
	}
})()

// Game 2: Roulette
let currentRotation
let hasSpun = false

document.addEventListener('DOMContentLoaded', () => {
	const wheel = document.getElementById('wheel')
	const spinBtn = document.getElementById('spinBtn')
	const rouletteModal = document.getElementById('orange8-modal')

	spinBtn.addEventListener('click', () => {
		if (!hasSpun) {
			currentRotation = 0
			const sectorCount = 16
			const randomSector = Math.floor(Math.random() * sectorCount)
			const sectorAngle = 360 / sectorCount
			const stopAngle = randomSector * sectorAngle

			const spins = 5
			const targetRotation = currentRotation + 360 * spins + (360 - stopAngle)
			currentRotation = targetRotation % 360

			wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)'
			wheel.style.transform = `rotate(${targetRotation}deg)`
			wheel.addEventListener(
				'transitionend',
				() => {
					spinBtn.textContent = 'Сделаю!'
					hasSpun = true
				},
				{ once: true }
			)
		} else {
			rouletteModal.classList.remove('active')
			spinBtn.textContent = 'Крутить'
			hasSpun = false
		}
	})
})

// Video
const videoSources = [
	'media/videos/video1.mp4',
	'media/videos/video2.mp4',
	'media/videos/video3.mp4',
	'media/videos/video4.mp4',
	'media/videos/video5.mp4',
	'media/videos/video6.mp4',
]

const modal = document.getElementById('video-modal')
const carousel = document.getElementById('carousel')
const closeBtn = document.querySelector('.close-btn')
const videoBtns = document.querySelectorAll('.video-btn')

let currentIndex = 0

videoBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		currentIndex = parseInt(btn.dataset.index)
		openModal(currentIndex)
		document.body.classList.add('no-scroll')
	})
})

closeBtn.addEventListener('click', () => {
	modal.classList.add('hidden')
	carousel.innerHTML = ''
	document.body.classList.remove('no-scroll')
})

function renderCarousel(activeIndex) {
	const videoElems = carousel.querySelectorAll('video')

	videoElems.forEach((video, i) => {
		video.classList.remove('active')

		if (i === activeIndex) {
			video.classList.add('active')
			video.controls = true
			video.muted = false
			video.play()
		} else {
			video.controls = false
			video.muted = true
			video.pause()
		}
	})

	// плавно сдвигаем всю карусель влево
	const videoWidth = videoElems[0].offsetWidth + 20 // видео + маржины
	const offset =
		activeIndex * videoWidth - (carousel.offsetWidth - videoWidth) / 2
	const maxOffset =
		videoElems.length * videoWidth - carousel.parentElement.offsetWidth
	const safeOffset = Math.min(offset, maxOffset)
	carousel.style.transform = `translateX(${-safeOffset}px)`

	carousel.style.transform = `translateX(${-offset}px)`
}

function openModal(index) {
	modal.classList.remove('hidden')

	// если впервые открыли — создаём видео
	if (carousel.children.length === 0) {
		for (let i = 0; i < videoSources.length; i++) {
			createVideoElement(i)
		}
	}

	currentIndex = index
	renderCarousel(index)
}

function createVideoElement(index) {
	const vid = document.createElement('video')
	vid.src = videoSources[index]
	vid.dataset.index = index
	vid.classList.add('carousel-video')
	vid.muted = true
	vid.loop = true
	vid.playsInline = true
	vid.autoplay = false

	vid.addEventListener('click', () => {
		currentIndex = index
		renderCarousel(currentIndex)
	})

	carousel.appendChild(vid)
}

// Portraits
const personsData = {
	1: {
		name: `Сергей, 64 года<br/>рак предстательной железы`,
		text: `<b><i>«Бывает, на даче к кормушке прилетают птицы, и я с женой наблюдаю за ними»</i></b>
<br/>
Я узнал о диагнозе в 63 года. Сразу IV стадия. Опухоль разрослась и теперь поражает скелет.
<br/>
Спустя некоторое время я сказал себе: «Сколько Бог дал, столько я и проживу». Врачи дали мне полгода. А я сам себе дал установку — прожить 22 года. 
<br/>
Временами я чувствую себя так, словно разгрузил вагон с углем. Но сейчас я <b><i>получаю удовольствие от простых вещей</i></b>. Бывает, на даче к кормушке прилетают птицы, и я с женой наблюдаю за ними. Я благодарю Бога, что он дал еще один день, чтобы это увидеть.
<br/>
Фонд мне очень помог, ведь помимо лечения нужна информация, куда и как обратиться, питание и много других нюансов. Но главное, я понял, что есть люди, которые могут сопереживать мне. И что нужно обращать внимание на свое здоровье, заботиться о близких.
<br/>
<b><i>Я обзвонил всех своих друзей-мужчин</i></b>. Шесть человек пошли на обследование ПСА, и у всех было обнаружено превышение. Хорошо, что в «серой зоне». Кто-то сделал операцию, кто-то находится под контролем. А я просто счастлив.
`,
	},
	2: {
		name: `Татьяна, 36 лет<br/>рак шейки матки`,
		text: `<b><i>«Я поняла, что диагноз — не приговор всему»</i></b>
<br/>
Я в зоне риска и много лет ежегодно наблюдалась у гинеколога. Когда стало сильно кровить, сходила на прием, прошла УЗИ, кольпоскопию, мазки на онкомаркеры. Ничего не выявили.
<br/> 
А спустя год снова кровотечение. Биопсия показала рак шейки матки, III стадия. С этого момента началась моя борьба.
<br/>
Химиотерапия, брахитерапия. Восстановление и рецидив, снова восстановление и рецидив.
<br/>
Сейчас я на иммунотерапии и <b><i>могу позволить себе работать, это моя победа!</i></b> 10 лет я была социальным психологом: помогала детям с аутизмом, ДЦП, ЗПР. Сейчас выбрала более спокойное направление — логопедию.
<br/>
Я поняла, что диагноз — не приговор всему. Работа и семья вытягивают меня из болезни. Муж записывал к врачу, разбирался в клинических рекомендациях. Детей мы не ограждали от проблем, и я чувствую их заботу. Как ответить на их вопрос: «Ты умрешь?». Мои дети очень тактильные, и <b><i>обнимашки порой громче слов</i></b>.
<br/>
«Онкологика» помогла мне оплатить трансфер и проживание на период обследования и консультаций, обеспечил такси к месту лечения. Фонд помогает нам найти ориентиры.
<br/>
Когда наступает беда, пожалуйста, не стесняйтесь просить о помощи.`,
	},
	3: {
		name: `Любовь, 67 лет<br/>рак легких`,
		text: `<b><i>«Мне помогает приготовление пирожков для 12 внуков»</i></b>
<br/>
Когда спрашивала врачей, сколько мне осталось, они отводили глаза и молчали. Было сложно принять болезнь, но очень помогли дети.
<br/>
Когда мне отказали в лечении, дочь нашла другую клинику, но за 4000 км, в Москве. «Онкологика» помогает с оплатой билетов и продуктовыми наборами. Если бы не фонд, то меня бы уже не было, а мне <b><i>так хочется еще пожить и насладиться простыми вещами</i></b>.
<br/>
Я начала получать иммунотерапию вместе с химиотерапией. От слабости мне помогает приготовление пирожков для 12 внуков! После каждого курса семья устраивает мне праздник: мы жарим шашлыки и покупаем вкусный торт.
<br/>
Когда закрывается одна дверь, обязательно открывается другая. Главное — продолжать жить, ведь жизнь одна, и второй такой не будет.
`,
	},
	4: {
		name: `Валерия, 25 лет<br/>рак яичника`,
		text: `<b><i>«Я лечусь, чтобы дарить и испытывать любовь»</i></b>
<br/>
Я училась в университете на переводчика, занималась журналистикой. Ходила на хайкинг – поднималась в горы, смотрела на смешных сурков, на горные водопады, голубые озера и реки. Занималась спортом, встала на сноуборд. Было очень много свободы!
<br/>
У меня была радикальная операция, и выписали меня уже с диагнозом. Спустя месяц начались курсы химиотерапии. 
<br/>
Психолог «Онкологики» помогла проработать страх смерти и рецидива, тревогу за близких. Помогла <b><i>осознать, что жизнь не замерла и не остановилась</i></b>. А на фотосессии, проведенной фондом, мне так захотелось запечатлеть себя новую, с короткими, чуть набравшими длину волосами после терапии. Было важно <b><i>запомнить этот момент жизни, каким бы он ни был</i></b>. 
<br/>
Я лечусь, чтобы воплощать свои мечты, чтобы быть рядом с близкими, дарить и испытывать любовь. Это дает мне сил идти к цели – войти в стойкую ремиссию.`,
	},
	5: {
		name: `Александр, 39 лет<br/>канцероматоз`,
		text: `<b><i>«Мы всегда что-то теряем и что-то находим. Нужно это принимать и благодарить жизнь»</i></b>
<br/>
Пять лет назад я уехал в Европу работать дальнобойщиком, но судьба резко изменила маршрут. У меня начали отказывать ноги. Госпитализация, анализы – и страшный вердикт: тромбы в обеих ногах, а причина – опухоль в брюшной полости.
<br/>
Опухоль росла стремительно, по несколько сантиметров в неделю. Меня экстренно прооперировали, потом была многократная химиотерапия. <b><i>Я вступил в чат для людей с раком и их близких «Следуй за мной», организованный «Онкологикой». Там познакомился с девушкой из своего города.</i></b>
<br/>
Мы очень сблизились. Когда начинали общаться, она еще могла ходить, но через два месяца стала лежачей. Я помогал чем мог, был с ней в больнице. К сожалению, в декабре того же года Юли не стало, но в моей жизни появился ее ребенок, он дает мне силы сражаться дальше…
<br/>
Мы всегда что-то теряем, но что-то обязательно находим. Нужно просто это принимать, как оно есть, и благодарить эту жизнь. За каждый подаренный день. Только позитивный настрой может вытащить из всего этого, я в этом уверен.`,
	},
	6: {
		name: `Никита, 20 лет<br/>рак яичника`,
		text: `<b><i>«Я получил лучшее лечение, но без “Онкологики” я бы не справился»</i></b>
<br/>
Я учусь на сварщика и очень люблю проводить время с друзьями. У меня их много, их поддержка придает мне сил в любой ситуации.
<br/>
Когда я узнал о своем диагнозе, было очень тяжело – впервые в жизни я не смог сдержать слез. Лечение началось в моем регионе, <b><i>но точный диагноз поставили не сразу, из-за этого болезнь успела распространиться по организму</i></b>. Уже в Москве я прошел химиотерапию, лучевую терапию и операцию.
<br/>
Фонд помог с оформлением инвалидности, отправил мне продуктовую корзину, обеспечил проживание и трансфер, пока я лечился далеко от дома. Я получил лучшее лечение, но без «Онкологики» я бы точно не справился.
<br/>
Эмоционально всегда тяжело вести борьбу с раком. Главное – не грустить и не отчаиваться!`,
	},
	7: {
		name: `Екатерина, 38 лет, лейкоз, и ее муж Александр`,
		text: `<b><i>«Переключайтесь, мечтайте. А еще не бойтесь просить помощи, вы не одни»</i></b>
<br/>
<b>Александр:</b>
<br/>
Когда жена сообщила о диагнозе, сказать, что я в шоке, это ничего не сказать. Непонимание, злость, грусть, страх. Главная мысль была: диагноз ошибочный. Но диагноз подтвердился, началась химиотерапия, поиск донора костного мозга, и я стал отсеивать негативные мысли. 
<br/>
Казалось, самым сложным будет совмещать работу с бытовыми задачами, которые раньше мы делили пополам. <b><i>Но самое сложное — это эмоционально не выгореть, чтобы сохранять позитивный настрой и поддерживать жену</i></b>. 
<br/>
<b>Екатерина:</b>
<br/>
Поддержка мужа невероятна. Он работал, присматривал с детьми и при этом приезжал ко мне каждый день, привозил чистые вещи. <b><i>Часто я могла видеть его только через больничное окно</i></b>. Когда было очень плохо и я не могла подойти к окну, все равно чувствовала его заботу. Меня окрыляли слова: «Мы справимся. Я тебя люблю».
<br/>
Всем, кто лечится от рака, хочу сказать: главное — мыслить позитивно, даже когда страх сковывает разум и тело. Переключайтесь, мечтайте. А еще не бойтесь просить помощи, вы не одни.`,
	},
	8: {
		name: `Екатерина, 48 лет<br/>рак яичника`,
		text: `<b><i>«Пройдя через всё это, я считаю себя героем»</i></b>
<br/>
Я работала на разных должностях: от администратора салона красоты до актрисы массовых сцен. В какой-то момент я заметила, что жизненная энергия начинает исчезать. На лице появились пятнышки, а живот стал сильно тянуть. 
<br/>
Я помню, как сделала МРТ и посмотрела на экран. Там всё было черным. Когда мне поставили третью стадию с метастазами, я подумала: как такое может быть?
<br/> 
После сложной операции курсы химиотерапии стали для меня страшным сном. Я потеряла 20 килограммов. <b><i>Со швами, дренажами, худая, словно маленький инопланетянин. У меня едва хватало сил, чтобы просто присесть на кровать.</i></b>
<br/>
Пройдя через всё это, я считаю себя героем. Фотосессия от фонда принесла мне огромное удовольствие. Эмоции каждой женщины на съемках были яркими и положительными. Каблуки пока носить сложно, но я уже могу взять себя в руки.
<br/>
Я люблю жизнь, а жизнь любит меня.
`,
	},
}

const modalPt = document.getElementById('portraitsModal')
const modalImgPt = modalPt.querySelector('.portraits-modal__image')
const modalNamePt = modalPt.querySelector('.portraits-modal__name')
const modalTextPt = modalPt.querySelector('.portraits-modal__text')
const closeBtnPt = modalPt.querySelector('.portraits-modal__close')
const portraitItems = document.querySelectorAll('.portraits-grid__item')

portraitItems.forEach(item => {
	item.addEventListener('click', () => {
		const personId = item.getAttribute('data-id')
		const personData = personsData[personId]

		modalImgPt.src = `media/portraits/${personId}.jpg`
		modalImgPt.alt = item.alt
		modalNamePt.innerHTML = `<h2>${personData.name}</h2>`
		modalTextPt.innerHTML = `<p>${personData.text}</p>`

		modalPt.classList.add('portraits-modal--active')
		document.body.classList.add('no-scroll')
	})
})

closeBtnPt.addEventListener('click', () => {
	modalPt.classList.remove('portraits-modal--active')
	document.body.classList.remove('no-scroll')
})

// Gray all except hovered
const oranges = document.querySelectorAll('.orange')

function isOrange4FullyPeeled(orange) {
	const img = orange.querySelector('img')
	return img.src.includes('peel4.avif') || img.src.includes('peel_gray.avif')
}

function isOrange4PartiallyPeeled(orange) {
	const img = orange.querySelector('img')
	return (
		img.src.includes('peel1.avif') ||
		img.src.includes('peel2.avif') ||
		img.src.includes('peel3.avif')
	)
}

function hasOrange4BeenTouched(orange) {
	const img = orange.querySelector('img')
	return img.src.includes('peel')
}

function isOrange5PlayingGif(orange) {
	const img = orange.querySelector('img')
	return img.src.includes('hedgehog.gif')
}

function grayAllExcept(except = null) {
	if (!orangeAnimationLock) {
		oranges.forEach(orange => {
			const img = orange.querySelector('img')

			if (orange === except) {
				if (orange.id === 'orange4') {
					if (isOrange4FullyPeeled(orange)) {
						img.src = 'media/peeling/peel4.avif'
					} else if (!isOrange4PartiallyPeeled(orange)) {
						img.src = 'media/orange.avif'
					}
				} else if (orange.id === 'orange5') {
					if (!isOrange5PlayingGif(orange)) {
						img.src = 'media/orange.avif'
					}
				} else {
					img.src = 'media/orange.avif'
				}
			} else {
				if (orange.id === 'orange4') {
					if (isOrange4FullyPeeled(orange)) {
						img.src = 'media/peeling/peel_gray.avif'
					} else if (!hasOrange4BeenTouched(orange)) {
						img.src = 'media/orange_gray.avif'
					}
				} else if (orange.id === 'orange5') {
					if (!isOrange5PlayingGif(orange)) {
						img.src = 'media/orange_gray.avif'
					}
				} else {
					img.src = 'media/orange_gray.avif'
				}
			}
		})
	}
}

function clearGray() {
	if (!orangeAnimationLock) {
		oranges.forEach(orange => {
			const img = orange.querySelector('img')

			if (orange.id === 'orange4') {
				if (isOrange4FullyPeeled(orange)) {
					img.src = 'media/peeling/peel4.avif'
				} else if (!isOrange4PartiallyPeeled(orange)) {
					img.src = 'media/orange.avif'
				}
			} else if (orange.id === 'orange5') {
				if (!isOrange5PlayingGif(orange)) {
					img.src = 'media/orange.avif'
				}
			} else {
				img.src = 'media/orange.avif'
			}
		})
	}
}

const ignoreSelectors = [
	'.bottom-pinata',
	'.donate_offer',
	'.donation-theme-widget-container',
	'.tree',
	'#background-audio',
	'#audio-toggle',
	'#open-cards-button',
	'#call-button',
	'p',
]

document.querySelectorAll('.container-inner *').forEach(el => {
	if (!el.closest('.orange') && !ignoreSelectors.some(sel => el.closest(sel))) {
		el.addEventListener('mouseenter', () => {
			grayAllExcept()
		})
		el.addEventListener('mouseleave', () => {
			clearGray()
		})
	}
})

oranges.forEach(orange => {
	orange.addEventListener('mouseenter', () => grayAllExcept(orange))
	orange.addEventListener('mouseleave', clearGray)
})

clearGray()

// Genral scrolling restriction for 2,7,8 modals
const modalIds = ['orange2-modal', 'orange7-modal', 'orange8-modal']

const modals = modalIds.map(id => document.getElementById(id)).filter(Boolean)

const checkScrollLock = () => {
	const anyActive = modals.some(modal => modal.classList.contains('active'))
	document.body.classList.toggle('no-scroll', anyActive)
}

const observer = new MutationObserver(checkScrollLock)

modals.forEach(modal => {
	observer.observe(modal, {
		attributes: true,
		attributeFilter: ['class'],
	})
})
