// helper: анимировать ширину через Web Animations API (fallback на CSS transition)
function animateWidth(
	el,
	toWidth,
	duration = 600,
	easing = 'cubic-bezier(.2,1.4,.5,1)'
) {
	if (el.animate) {
		const from = getComputedStyle(el).width
		const anim = el.animate([{ width: from }, { width: toWidth }], {
			duration: duration,
			easing: easing,
			fill: 'forwards',
		})
		return anim.finished.catch(() => {})
	} else {
		el.style.width = toWidth
		return Promise.resolve()
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const container = document.querySelector('.container')
	const boxContainer = document.querySelector('.search-box-container')
	const submit =
		document.querySelector('.submit') ||
		document.querySelector('.search-box-container button')
	const searchBox = document.querySelector('.search-box')
	const response = document.querySelector('.response')

	let isOpen = false
	const OPEN_WIDTH = '320px'
	const CLOSED_WIDTH = '50px'

	async function toggleState(open) {
		await animateWidth(
			boxContainer,
			open ? OPEN_WIDTH : CLOSED_WIDTH,
			600,
			'cubic-bezier(.2,1.4,.5,1)'
		)
	}

	function showResponse(text) {
		if (!response) return
		response.textContent = text
		response.style.transition = 'opacity 300ms ease'
		response.style.opacity = '1'
		setTimeout(() => {
			response.style.opacity = '0'
		}, 2300)
	}

	function handleRequest() {
		if (!searchBox) return
		const value = searchBox.value.trim()
		searchBox.value = ''
		if (value.length > 0) {
			showResponse(`Searching for "${value}" . . .`)
			// здесь можно выполнить fetch/ajax
		}
	}

	if (submit) {
		submit.addEventListener('mousedown', function (e) {
			e.preventDefault()
			toggleState(!isOpen)
			isOpen = !isOpen
			if (!isOpen) {
				handleRequest()
			} else {
				setTimeout(() => searchBox && searchBox.focus(), 50)
			}
		})
	}

	if (searchBox) {
		searchBox.addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault()
				toggleState(false)
				isOpen = false
				handleRequest()
			}
		})

		searchBox.addEventListener('blur', function () {
			toggleState(false)
			isOpen = false
		})
	}
})
const qInput = document.querySelector('.queue-search-input')
qInput.addEventListener('input', function () {
	const q = this.value.toLowerCase()
	document.querySelectorAll('.queue-item').forEach(li => {
		const text = (
			li.querySelector('.qi-title').textContent +
			' ' +
			li.querySelector('.qi-artist').textContent
		).toLowerCase()
		li.style.display = text.includes(q) ? '' : 'none'
	})
})
