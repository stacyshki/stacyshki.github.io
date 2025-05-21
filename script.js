// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
	const confettiManager = new ConfettiManager()
	const pinataManager = new PinataManager(confettiManager)

	// Handle loading screen
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

	Promise.all([...imgPromises, ...bgPromises]).then(() => {
		clearInterval(loadingInterval)
		loadingPercentage = 100
		loadingElement.textContent = '100%'

		loadingScreen.style.animation = 'slideUp 0.5s forwards'
		setTimeout(() => {
			loadingScreen.style.display = 'none'
			container.style.display = 'flex'
		}, 500)
	})

	document.getElementById('orange5').addEventListener('click', function () {
		this.classList.remove('clicked')
		void this.offsetWidth // Trigger reflow
		this.classList.add('clicked')
	})
	document.getElementById('orange4').addEventListener('click', function () {
		this.classList.remove('clicked')
		void this.offsetWidth
		this.classList.add('clicked')
	})

	document.getElementById('orange6').addEventListener('click', function () {
		this.classList.remove('clicked')
		void this.offsetWidth
		this.classList.add('clicked')
	})

	const helpButton = document.getElementById('help-button')
	if (helpButton) {
		helpButton.addEventListener('click', () => {
			window.scrollTo({
				top: document.body.scrollHeight - document.body.scrollHeight * 0.4,
				behavior: 'smooth',
			})
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
				window.scrollTo({
					top: document.body.scrollHeight - document.body.scrollHeight * 0.4,
					behavior: 'smooth',
				})
			}, 200)
		})
	})

	document.querySelectorAll('.team-help-button-more').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.orange-modal.active').forEach(modal => {
				modal.classList.remove('active')
			})

			document.getElementById('close-orange1-modal-more').click()

			setTimeout(() => {
				window.scrollTo({
					top: document.body.scrollHeight - document.body.scrollHeight * 0.4,
					behavior: 'smooth',
				})
			}, 200)
		})
	})

	const pairs = [
		{ trigger: '.caterpillar', modal: '.caterpillar-modal' },
		{ trigger: '.bird', modal: '.bird-modal' },
	]

	pairs.forEach(({ trigger, modal }) => {
		const triggerEl = document.querySelector(trigger)
		const modalEl = document.querySelector(modal)

		if (triggerEl && modalEl) {
			triggerEl.addEventListener('click', function (e) {
				e.stopPropagation()
				modalEl.style.display = 'block'
			})

			modalEl.addEventListener('click', function (e) {
				e.stopPropagation()
			})
		}
	})

	document.addEventListener('click', function () {
		pairs.forEach(({ modal }) => {
			const modalEl = document.querySelector(modal)
			if (modalEl) modalEl.style.display = 'none'
		})
	})
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
	canvas.width = pinataArea.offsetWidth
	canvas.height = pinataArea.offsetHeight

	const pinataRect = pinata.getBoundingClientRect()
	const pinataCenterX =
		pinataRect.left -
		pinataArea.getBoundingClientRect().left +
		pinataRect.width / 2
	const pinataCenterY =
		pinataRect.top -
		pinataArea.getBoundingClientRect().top +
		pinataRect.height / 2

	const confettiImages = []
	for (let i = 1; i <= 9; i++) {
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
pinataImages.default.src = 'media/pinata.svg'
pinataImages.hover.src = 'media/pinata-hover.svg'

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
			hintElement.textContent = 'Продолжай нажимать, чтобы сломать пинату!'
			hintElement.style.position = 'absolute'
			hintElement.style.top = '5%'
			hintElement.style.left = '50%'
			hintElement.style.transform = 'translateX(-50%)'
			hintElement.style.backgroundColor = '#f2994a'
			hintElement.style.color = 'white'
			hintElement.style.padding = '5px'
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
	{ company: 'StockX', code: 'WINTER25' },
	{ company: 'Temu', code: 'OFF40' },
	{ company: 'HnM', code: '30POP5' },
]

function getRandomPromoCode() {
	const randomIndex = Math.floor(Math.random() * promoCodes.length)
	return promoCodes[randomIndex]
}

function showPopup() {
	popupShown = true
	const promo = getRandomPromoCode()
	const promoElement = document.createElement('div')
	promoElement.innerHTML = `<strong>${promo.company}</strong>: <span style="text-decoration: underline; color: #2e2c24; cursor: pointer;">${promo.code}</span>`
	promoElement.addEventListener('click', () => {
		navigator.clipboard.writeText(promo.code).then(() => {
			alert('Промокод скопирован в буфер обмена!')
		})
	})
	const popup = document.getElementById('popup-backdrop')
	const promoContainer = popup.querySelector('p')
	promoContainer.innerHTML = '' // Clear existing promo code
	promoContainer.appendChild(promoElement)
	popup.style.display = 'flex'
}

document
	.getElementById('popup-backdrop')
	.addEventListener('mousedown', function (e) {
		if (e.target === this) {
			this.style.display = 'none'
			popupShown = false
			clickCount = 0
			allConfetti = [] // Clear all confetti
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId)
				animationFrameId = null
			}
			// Restart the confetti animation
			const confettiManager = new ConfettiManager()
			confettiManager.clear()
			confettiManager.animate()
		}
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
			default: 'media/pinata.svg',
			hover: 'media/pinata-hover.svg',
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
		for (let i = 1; i <= 9; i++) {
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
		// Recalculate pinata's position each time
		const pinataRect = this.canvas.getBoundingClientRect()
		const pinataCenterX = pinataRect.left + pinataRect.width / 2
		const pinataCenterY = pinataRect.top + pinataRect.height / 2

		const baseConfettiCount = 8
		const additionalConfetti = clickCount * 2
		const confettiCount = Math.min(baseConfettiCount + additionalConfetti, 12)

		for (let i = 0; i < confettiCount; i++) {
			this.confetti.push({
				x: pinataCenterX - this.canvas.offsetLeft,
				y: pinataCenterY - this.canvas.offsetTop,
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
		link.href = `media/${cardFileName}`
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
	.addEventListener('click', () => {
		if (selectedCard) {
			const link = document.createElement('a')
			link.href = `media/${selectedCard}`
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

// Add a debounced event listener for orientation changes
window.addEventListener('orientationchange', debounce(checkOrientation, 200))

document.addEventListener('DOMContentLoaded', checkOrientation)

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
		orange.addEventListener('click', function () {
			modal.classList.toggle('active')
		})
	}
})

document.querySelectorAll('.close-modal').forEach(button => {
	button.addEventListener('click', function () {
		const modal = this.closest('.orange-modal')
		if (modal) modal.classList.remove('active')
	})
})

document.getElementById('learn-more').addEventListener('click', () => {
	document.getElementById('orange1-modal-more').style.display = 'flex'
})

document
	.getElementById('close-orange1-modal-more')
	.addEventListener('click', () => {
		document.getElementById('orange1-modal-more').style.display = 'none'
	})

// Game 1: Paint
;(function () {
	const canvas = document.getElementById('orangeCanvas')
	const ctx = canvas.getContext('2d')

	const centerX = canvas.width / 2
	const centerY = canvas.height / 2
	const radius = Math.min(canvas.width, canvas.height) / 2

	let drawing = false
	let currentColor = 'orange'

	const orangeImg = new Image()
	orangeImg.src = 'media/color_orange.svg'

	orangeImg.onload = () => {
		drawBase()
	}

	function drawBase() {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(
			orangeImg,
			centerX - radius,
			centerY - radius,
			radius * 2,
			radius * 2
		)
	}

	document.querySelectorAll('.color-btn').forEach(btn => {
		btn.addEventListener('click', () => {
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
		return {
			x: e.touches[0].clientX - rect.left,
			y: e.touches[0].clientY - rect.top,
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
		}
	}

	canvas.addEventListener('mousemove', e => {
		if (!drawing) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top
		handleDraw({ x, y })
	})

	window.saveDrawing = function () {
		const link = document.createElement('a')
		link.download = 'orange.png'
		link.href = canvas.toDataURL()
		link.click()
	}

	window.clearCanvas = function () {
		drawBase()
	}
})()

// Game 2: Roulette
const sectors = [
	'Подари улыбку',
	'Позвони бабушке',
	'Помоги другу',
	'Поделись конфетой',
	'Убери комнату',
	'Напиши открытку',
	'Обними маму',
	'Скажи спасибо',
]

let currentRotation = 0

document.addEventListener('DOMContentLoaded', () => {
	const wheel = document.getElementById('wheel')
	const spinBtn = document.getElementById('spinBtn')
	const resultText = document.getElementById('resultText')

	spinBtn.addEventListener('click', () => {
		const sectorCount = sectors.length
		const randomSector = Math.floor(Math.random() * sectorCount)
		const sectorAngle = 360 / sectorCount
		const stopAngle = randomSector * sectorAngle

		const spins = 5
		const targetRotation = currentRotation + 360 * spins + (360 - stopAngle)
		currentRotation = targetRotation % 360

		wheel.style.transition = 'transform 5s cubic-bezier(0.33, 1, 0.68, 1)'
		wheel.style.transform = `rotate(${targetRotation}deg)`

		resultText.textContent = ''
		openSharePopup.style.display = 'none'

		const result = sectors[randomSector]

		setTimeout(() => {
			resultText.textContent = `Выпало: ${result}`
			openSharePopup.style.display = 'inline-block'

			const text = `Я выбрал из колеса добрых дел: ${result} 😊`
			const url = location.href

			tgLink.href = `https://t.me/share/url?url=${encodeURIComponent(
				url
			)}&text=${encodeURIComponent(text)}`
			vkLink.href = `https://vk.com/share.php?url=${encodeURIComponent(
				url
			)}&title=${encodeURIComponent(text)}`
			waLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(
				text + ' ' + url
			)}`
		}, 250)
	})
})

const openSharePopup = document.getElementById('openSharePopup')
const sharePopup = document.getElementById('sharePopup')

const tgLink = document.getElementById('tgLink')
const vkLink = document.getElementById('vkLink')
const waLink = document.getElementById('waLink')

openSharePopup.addEventListener('click', () => {
	sharePopup.classList.remove('hidden')
})

window.addEventListener('click', e => {
	if (e.target === sharePopup) {
		sharePopup.classList.add('hidden')
	}
})
