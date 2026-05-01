const { badWords } = require("./badwords.ko.config");

class Filter {
  /**
   * Filter constructor.
   * @constructor
   * @param {object} options - Filter instance options
   * @param {boolean} options.emptyList - Instantiate filter with no blacklist
   * @param {string[]} options.list - Additional words to add to blacklist
   * @param {string[]} options.exclude - Words to exclude from blacklist (whitelist)
   * @param {string} options.placeHolder - Character used to replace profane words (default: "*")
   * @param {RegExp} options.replaceRegex - Regex to match characters for replacement (default: /[\s\S]/g)
   * @param {RegExp} options.splitRegex - Regex to split string into words (default: /\s/)
   */
  constructor(options = {}) {
    this.options = {
      list: options.emptyList ? [] : [...badWords, ...(options.list || [])],
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /(\s+)/,
      placeHolder: options.placeHolder || "*",
      replaceRegex: options.replaceRegex || /[\s\S]/g,
    };
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    const { exclude, list } = this.options;
    return list.some(
      (word) =>
        !exclude.includes(word) && new RegExp(word.trim(), "gi").test(string),
    );
  }

  /**
   * Replace a word with placeHolder characters.
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    const { placeHolder, replaceRegex } = this.options;
    return string.replace(replaceRegex, placeHolder);
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
      .join("");
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} wordsToAdd - Word(s) to add to blacklist
   */
  addWords(...wordsToAdd) {
    const { list, exclude } = this.options;
    list.push(...wordsToAdd);
    wordsToAdd.forEach((word) => {
      const idx = exclude.indexOf(word);
      if (idx !== -1) exclude.splice(idx, 1);
    });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} wordsToRemove - Word(s) to add to whitelist.
   */
  removeWords(...wordsToRemove) {
    this.options.exclude.push(
      ...wordsToRemove.map((word) => word.toLowerCase()),
    );
  }
}

module.exports = Filter;
