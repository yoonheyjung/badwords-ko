// const badWords = require("./badwords.ko.config").badWords;
const { badWords } = require("./badwords.ko.config");

class Filter {
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {array} options.list - Instantiate filter with custom list
   * @param {string} options.placeHolder - Character used to replace profane words.
   * @param {string} options.regex - Regular expression used to sanitize words before comparing them to blacklist.
   * @param {string} options.replaceRegex - Regular expression used to replace profane words with placeHolder.
   * @param {string} options.splitRegex - Regular expression used to split a string into words.
   */
  constructor(options = {}) {
    this.options = {
      list: options.emptyList ? [] : [...badWords, ...(options.list || [])],
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\s/,
      placeHolder: options.placeHolder || "*",
      regex: options.regex || /[^a-zA-Z0-9|$|@]|^/g,
      replaceRegex: options.replaceRegex || /\w/g,
    };
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    const { exclude, list } = this.options;

    return list.some((word) => {
      const wordExp = new RegExp(word.trim(), "g");
      return !exclude.includes(word) && wordExp.test(string);
    });
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    const { regex, replaceRegex, placeHolder } = this.options;

    return string
      .replace(regex, placeHolder)
      .replace(replaceRegex, placeHolder);
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    const { splitRegex } = this.options;

    return string
      .split(splitRegex)
      .map((word) => (this.isProfane(word) ? this.replaceWord(word) : word))
      .join(" ");
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords(...wordsToAdd) {
    const { list, exclude } = this.options;

    list.push(...wordsToAdd);
    wordsToAdd.forEach((word) => {
      const index = exclude.indexOf(word);
      if (index !== -1) {
        exclude.splice(index, 1);
      }
    });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords(...wordsToRemove) {
    const { exclude } = this.options;

    exclude.push(...wordsToRemove.map((word) => word.toLowerCase()));
  }
}

module.exports = Filter;
