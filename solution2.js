/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */
async function searchShows(query) {
	try {
		let res = await axios.get('http://api.tvmaze.com/search/shows', { params: { q: query } });
		return res.data.map((obj) => {
			return {
				id: obj.show.id,
				name: obj.show.name,
				summary: obj.show.summary,
				image: obj.show.image.medium
			};
		});
	} catch (err) {
		alert('Oops! Something went wrong. Please try again.');
		throw new Error(err);
	}
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
        <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${show.image ? show.image : 'https://tinyurl.com/tv-missing'}">
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">${show.summary}</p>
            <button data-button-id="episodes-btn" class="btn btn-info" type="button" data-toggle="modal" data-target="#episodes-modal">Show Episodes</button>
          </div>
        </div>
      </div>
      `
		);

		$showsList.append($item);
	}
}

/* Populate episodes for the show clicked */
function populateEpisodes(episodes) {
	const $episodesList = $('#episodes-area');

	$episodesList.empty();

	for (let ep of episodes) {
		let $episode = $(`<li>${ep.name} (season ${ep.season}, number ${ep.number})</li>`);
		$episodesList.append($episode);
	}
	$('#episodes-area').show();
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

// Add listener for show episodes
document.getElementById('shows-list').addEventListener('click', (evt) => {
	handleShowEpisodes(evt);
});

/*Handle show episodes button click
*     - Get list of show's episodes
      - Uhide episodes area
*/
async function handleShowEpisodes(evt) {
	if (evt.target.dataset.buttonId === 'episodes-btn') {
		let episodes = await getEpisodes(evt.target.parentElement.parentElement.dataset.showId);

		populateEpisodes(episodes);
	}
}

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
	try {
		let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
		console.log(res);
		return res.data.map((obj) => {
			return {
				id: obj.id,
				name: obj.name,
				season: obj.season,
				number: obj.number
			};
		});
	} catch (err) {
		alert('Oops! Something went wrong. Please try again.');
		throw new Error(err);
	}
}
