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
			x: pinataCenterX, // Align with pinata
			y: pinataCenterY, // Align with pinata
			size: randomBetween(30, 50), // Increase size
			angle: randomBetween(0, 2 * Math.PI),
			speed: randomBetween(1, 3),
			dx: randomBetween(-3, 3), // Increase spread
			dy: randomBetween(-5, -3), // Increase spread
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

function handlePinataMouseEnter(e) {
	pinata.src = pinataImages.hover.src
	const currentRotation = getCurrentRotation(pinata)
	const pinataRect = pinata.getBoundingClientRect()
	const mouseX = e.clientX
	const pinataCenterX = pinataRect.left + pinataRect.width / 2

	pinata.style.setProperty('--current-rotation', `${currentRotation}deg`)
	pinata.classList.remove('pinata-shake-left', 'pinata-shake-right')
	void pinata.offsetWidth // Force reflow

	if (mouseX > pinataCenterX) {
		pinata.classList.add('pinata-shake-right')
	} else {
		pinata.classList.add('pinata-shake-left')
	}
}

function handlePinataMouseLeave() {
	pinata.src = pinataImages.default.src
}

// Update pinata event listeners
if (pinata) {
	pinata.src = pinataImages.default.src
	pinata.addEventListener('mouseenter', handlePinataMouseEnter)
	pinata.addEventListener('mouseleave', handlePinataMouseLeave)
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
			hintElement.style.top = '10px'
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
	promoElement.innerHTML = `<strong>${promo.company}</strong>: <span style="text-decoration: underline; color: blue; cursor: pointer;">${promo.code}</span>`
	promoElement.addEventListener('click', () => {
		navigator.clipboard.writeText(promo.code).then(() => {
			alert('Promo code copied to clipboard!')
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

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
	const confettiManager = new ConfettiManager()
	const pinataManager = new PinataManager(confettiManager)

	// Handle loading screen
	const loadingScreen = document.getElementById('loading-screen')
	const container = document.querySelector('.container')

	loadingScreen.style.animation = 'slideUp 0.5s forwards'
	setTimeout(() => {
		loadingScreen.style.display = 'none'
		container.style.display = 'flex'
	}, 10000)

	let loadingPercentage = 0
	const loadingInterval = setInterval(() => {
		if (loadingPercentage < 100) {
			loadingPercentage += 1
			document.getElementById(
				'loading-percentage'
			).textContent = `${loadingPercentage}%`
		} else {
			clearInterval(loadingInterval)
		}
	}, 80)

	document.getElementById('orange5').addEventListener('click', function () {
		this.classList.remove('clicked')
		void this.offsetWidth // Trigger reflow
		this.classList.add('clicked')
	})
	document.getElementById('orange4').addEventListener('click', function () {
		this.classList.remove('clicked')
		void this.offsetWidth // Trigger reflow
		this.classList.add('clicked')
	})

	document.getElementById('orange6').addEventListener('click', function () {
		this.classList.remove('clicked')
		void this.offsetWidth // Trigger reflow
		this.classList.add('clicked')
	})

	const hedgehogImage = new Image()
	hedgehogImage.src = 'media/hedgehog/hedgehog.svg'

	const peel1Image = new Image()
	peel1Image.src = 'media/peeling/peel1.svg'

	const peel2Image = new Image()
	peel2Image.src = 'media/peeling/peel2.svg'

	const peel3Image = new Image()
	peel3Image.src = 'media/peeling/peel3.svg'

	const orangeImage = new Image()
	orangeImage.src = 'media/orange.svg'

	const modalWinImage = new Image()
	modalWinImage.src = 'media/modal_win.svg'

	const helpButton = document.getElementById('help-button')
	if (helpButton) {
		helpButton.addEventListener('click', () => {
			window.scrollTo({
				top: document.body.scrollHeight,
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
				x: pinataCenterX - this.canvas.offsetLeft, // Align with pinata
				y: pinataCenterY - this.canvas.offsetTop, // Align with pinata
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

// Function to check orientation and display a prompt
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

// Initial check on page load
document.addEventListener('DOMContentLoaded', checkOrientation)

// Function to get the current rotation angle of an element
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
		this.parentElement.classList.remove('active')
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

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.team-help-button').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.orange-modal.active').forEach(modal => {
				modal.classList.remove('active')
			})

			setTimeout(() => {
				window.scrollTo({
					top: document.body.scrollHeight,
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
					top: document.body.scrollHeight,
					behavior: 'smooth',
				})
			}, 200)
		})
	})
})
