const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

// Function to set the theme in local storage
function setTheme(theme) {
	localStorage.setItem('theme', theme);
}

// Function to get the theme from local storage
function getTheme() {
	return localStorage.getItem('theme') || 'light'; // Default to light if the theme is not set
}

let currentTheme = getTheme(); // Initialize the current theme from local storage

const switchMode = document.getElementById('switch-mode');

// Function to update the theme
function updateTheme() {
	if (currentTheme === 'dark') {
		document.body.classList.add('dark');
		updateTextColor('white');

	} else {
		document.body.classList.remove('dark');
		updateTextColor('black');
	}
}

// Function to update the switch state based on the theme
function updateSwitchState() {
	switchMode.checked = currentTheme === 'dark';
}

// Update the theme and switch state on page load
updateTheme();
updateSwitchState();

switchMode.addEventListener('change', function () {
	if (this.checked) {
		currentTheme = 'dark';
	} else {
		currentTheme = 'light';
	}
	setTheme(currentTheme); // Save the selected theme to local storage
	updateTheme(); // Update the theme immediately
});

// Function to get the current theme
function getCurrentTheme() {
	return currentTheme;
}

function updateTextColor(color) {
    const colorChangeElements = document.querySelectorAll('.color_change,.content');

    colorChangeElements.forEach(element => {
        element.style.color = color;
    });
}