var imageContainer = document.querySelector('.user__img'),
		tinyImageContainer = document.querySelector('.header__options-profile'),
		basicInfo = document.querySelector('.user__info-basic'),
		metaInfo = document.querySelector('.user__info-meta'),
		repoList = document.querySelector('.repo__list'),
		searchInput = document.querySelector('.header__search')

var userUrl = 'https://api.github.com/users/buckymaler'
var repoUrl = 'https://api.github.com/users/buckymaler/repos'

var icon_location = '<svg height="16" version="1.1" viewBox="0 0 20 32" width="12"><path d="M10 0C4.5 0 0 4.5 0 10s5 13 10 22c5-9 10-16.5 10-22S15.5 0 10 0zM10 14c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4S12.2 14 10 14z"/></svg>'
var icon_email = '<svg height="16" version="1.1" viewBox="0 0 20 16" width="14"><path d="M10 7l8-5H2L10 7zM18 14V4l-8 5L2 4v10H18L18 14zM18 0c1.1 0 2 0.9 2 2v12c0 1.1-0.9 2-2 2H2c-1.1 0-2-0.9-2-2V2c0-1.1 0.9-2 2-2H18z"/></svg>'
var icon_blog = '<svg height="16" version="1.1" viewBox="0 0 20 10" width="16"><path d="M15 0c2.8 0 5 2.2 5 5s-2.2 5-5 5h-4V8.1h4c1.7 0 3.1-1.4 3.1-3.1S16.7 1.9 15 1.9h-4V0C11 0 15 0 15 0zM6 6V4h8v2H6zM1.9 5c0 1.7 1.4 3.1 3.1 3.1h4V10H5c-2.8 0-5-2.2-5-5s2.2-5 5-5h4v1.9H5C3.3 1.9 1.9 3.3 1.9 5z"/></svg>'
var icon_clock = '<svg height="16" version="1.1" viewBox="0 0 26 26" width="14"><path d="M13 0C5.8 0 0 5.8 0 13s5.8 13 13 13c7.2 0 13-5.8 13-13S20.2 0 13 0zM12.9 23.5C7.1 23.5 2.4 18.8 2.4 13S7.1 2.5 12.9 2.5c5.8 0 10.5 4.7 10.5 10.5S18.7 23.5 12.9 23.5zM15.9 13.6h-3v-5c0-0.5-0.4-1-1-1s-1 0.4-1 1v6c0 0.5 0.4 1 1 1h4c0.5 0 1-0.4 1-1C16.9 14.1 16.5 13.6 15.9 13.6z"/></svg>'
var icon_star = '<svg height="16" version="1.1" viewBox="0 0 20 19" width="14"><path d="M10 15.2L3.8 19l1.6-7L0 7.2l7.2-0.6L10 0l2.8 6.6L20 7.2 14.5 12l1.6 7L10 15.2z"/></svg>'

var search = function(ev) {
	if (ev.keyCode === 13) {
		var queryVal = ev.target.value
		try {
			userUrl = 'https://api.github.com/users/' + queryVal + '?access_token=' + ACCESS_TOKEN
			repoUrl = 'https://api.github.com/users/' + queryVal + '/repos?access_token=' + ACCESS_TOKEN
		}
		catch (error) {
			userUrl = 'https://api.github.com/users/' + queryVal
			repoUrl = 'https://api.github.com/users/' + queryVal + '/repos'
		}
		injectUserComponent(userUrl)
		injectReposComponent(repoUrl)
		ev.target.value = ''
	}
}

searchInput.addEventListener('keypress', search)

function injectUserComponent(url) {

	var handleRetrievedData = function(user) {
		imageContainer.innerHTML = ''
		tinyImageContainer.innerHTML = ''
		basicInfo.innerHTML = ''
		metaInfo.innerHTML = ''
		var basicInfoHTML = '',
				metaInfoHTML = ''
		imageContainer.innerHTML = '<img class="user__img-el" src=' + user.avatar_url + '></img>'
		tinyImageContainer.innerHTML += '<img src=' + user.avatar_url + '></img>'
		tinyImageContainer.innerHTML += '<span class="header__options-tooltip"></span>'
		basicInfoHTML += user.name ? '<h1>' + user.name + '</h1>' : ''
		basicInfoHTML += '<h2>' + user.login + '</h2>'
		basicInfoHTML += user.bio ? '<p>' + user.bio + '</p>' : ''
		basicInfoHTML += '<button class="user__info-btn value="Edit profile">Edit profile</button>'
		metaInfoHTML += user.location ? '<li>' + icon_location + user.location + '</li>' : ''
		metaInfoHTML += user.email ? '<li>' + icon_email + '<a href="#0" class="link link--underline">' + user.email + '</a></li>' : ''
		metaInfoHTML += user.blog ? '<li>' + icon_blog + '<a href="#0" class="link link--underline">http://' + user.blog + '</a></li>' : ''
		var date = correctDate(user.created_at)
		metaInfoHTML += user.created_at ? '<li>' + icon_clock + 'Joined on ' + date + '</li>' : ''
		basicInfo.innerHTML = basicInfoHTML
		metaInfo.innerHTML = metaInfoHTML
	}

	var correctDate = function(date) {
		var date = new Date(date),
				dateStr = date.toDateString()
				dateArr = dateStr.split(' ')
		return dateArr[1] + ' ' + parseInt(dateArr[2]) + ', ' + dateArr[3]
	}

	var promise = $.getJSON(url)
	promise.then(handleRetrievedData)

}

function injectReposComponent(url) {

	var handleRetrievedData = function(repos) {
		repoList.innerHTML = ''
		for (var i = 0; i < repos.length; i++) {
			var repo = repos[i],
					repoEl = document.createElement('li'),
					basicInfo = document.createElement('div'),
					metaInfo = document.createElement('div'),
					metaLanguage = document.createElement('div'),
					metaStar = document.createElement('div'),
					basicInfoHTML = '',
					metaLanguageHTML = '',
					metaStarHTML = ''
			repoEl.className = 'repo__list-el l-cf'
			basicInfo.className = 'basic'
			metaInfo.className = 'meta'
			metaLanguage.className = 'meta__language'
			metaStar.className = 'meta__star'
			basicInfoHTML += '<a class="link link--underline" href="#0">' + repo.name + '</a>'
			basicInfoHTML += repo.description ? '<p>' + repo.description + '</p>' : ''
			var color = styleColorSwatch(repo.language)
			metaLanguageHTML += '<span class="meta__language-color" style="background-color: ' + color + '"></span>'
			metaLanguageHTML += repo.language ? '<span class="meta__language-el">' + repo.language + '</span>' : ''
			metaStarHTML += icon_star
			metaStarHTML += '<span class="meta__star-count">' + repo.stargazers_count + '</span>'
			basicInfo.innerHTML = basicInfoHTML
			metaLanguage.innerHTML = metaLanguageHTML
			metaStar.innerHTML = metaStarHTML
			metaInfo.appendChild(metaLanguage)
			metaInfo.appendChild(metaStar)
			repoEl.appendChild(basicInfo)
			repoEl.appendChild(metaInfo)
			repoList.appendChild(repoEl)
		}
	}

	var styleColorSwatch = function(language) {
		if (language) {
			var color = ''
			switch(language) {
				case 'HTML':
					color = '#e44b23'
					break
				case 'CSS':
					color = '#563d7c'
					break
				case 'JavaScript':
					color = '#f1e05a'
					break
				default:
					color = '#178600'
			}
			return color
		}
	}

	var promise = $.getJSON(url)
	promise.then(handleRetrievedData)

}

var main = function() {
	injectUserComponent(userUrl)
	injectReposComponent(repoUrl)
}

main()
