import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import {
  changeFocusAction,
  suggestGenresAction,
  resetGenresSuggestionsAction,
  selectSuggestionAction,
  validSuggestionAction
} from '../../actions/searchGenresActions';

import SearchGenreSuggestions from './SearchGenreSuggestions';
import magnifyingGlass from './magnifying-glass.png';
import './searchGenres.css';

function mapStoreToProps(store) {
  return {
    suggestions: store.searchGenre.suggestions,
    isFocused: store.searchGenre.isFocused,
    selectedSuggestion: store.searchGenre.selectedSuggestion,
  };
}
class SearchGenre extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };
  }

  onFocus = () => {
    this.props.dispatch(changeFocusAction(true));
  }

  onBlur = () => {
    if (!this.state.text.length) {
      this.props.dispatch(changeFocusAction(false));
    }
  }

  handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      this.props.dispatch(selectSuggestionAction('down'));
    } else if (event.key === 'ArrowUp') {
      this.props.dispatch(selectSuggestionAction('up'));
    } else if (event.key === 'Enter') {
      const selectedSuggestion = this.props.suggestions[this.props.selectedSuggestion];
      if (selectedSuggestion) {
        this.props.dispatch(validSuggestionAction(selectedSuggestion.slug));
      } else {
        this.searchGenre();
      }
    }
  }

  handleChange = (event) => {
    const text = event.target.value;
    this.setState({ text });
    if (text.length >= 3) {
      this.props.dispatch(suggestGenresAction(text));
    } else {
      this.props.dispatch(resetGenresSuggestionsAction());
    }
  }

  handleSearchClick = () => {
    this.searchGenre();
  }

  searchGenre() {
    if (this.state.text) {
      this.props.searchGenresHandler(this.state.text);
      this.setState({ text: '' });
    }
  }

  render() {
    return (
      <div className="search-genres-container" onKeyDown={this.handleKeyDown}>
        <p>
          <span className={"search-input-container " + (this.props.isFocused ? 'focused' : '')}>
            <input
              type="text"
              className="search-input"
              placeholder="Look for a genre"
              onChange={this.handleChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              value={this.state.text}
            />
            <img src={magnifyingGlass} className="search-icon" alt="Search music genres!" onClick={this.handleSearchClick} />
          </span>
        </p>
        <SearchGenreSuggestions></SearchGenreSuggestions>
      </div>
    );
  }
}
export default connect(mapStoreToProps)(SearchGenre);

SearchGenre.propTypes = {
   searchGenresHandler: PropTypes.func.isRequired,
}
