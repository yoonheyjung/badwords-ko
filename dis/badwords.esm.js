import { badWords } from "./badwords.ko.config.json";

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
    Object.assign(this, {
      list:
        (options.emptyList && []) ||
        Array.prototype.concat.apply(badWords, [options.list || []]),
      exclude: options.exclude || [],
      splitRegex: options.splitRegex || /\s/,
      placeHolder: options.placeHolder || "*",
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g,
    });
  }

  /**
   * Determine if a string contains profane language.
   * @param {string} string - String to evaluate for profanity.
   */
  isProfane(string) {
    return (
      this.list.filter((word) => {
        word = word.trim();
        const wordExp = new RegExp(word, "g");
        return !this.exclude.includes(word) && wordExp.test(string);
      }).length > 0 || false
    );
  }

  /**
   * Replace a word with placeHolder characters;
   * @param {string} string - String to replace.
   */
  replaceWord(string) {
    return string
      .replace(this.regex, "*")
      .replace(this.replaceRegex, this.placeHolder);
  }

  /**
   * Evaluate a string for profanity and return an edited version.
   * @param {string} string - Sentence to filter.
   */
  clean(string) {
    return string
      .split(this.splitRegex)
      .map((word) => {
        return this.isProfane(word) ? this.replaceWord(word) : word;
      })
      .join(" ");
  }

  /**
   * Add word(s) to blacklist filter / remove words from whitelist filter
   * @param {...string} word - Word(s) to add to blacklist
   */
  addWords() {
    let words = Array.from(arguments);

    this.list.push(...words);

    words.forEach((word) => {
      if (this.exclude.includes(word)) {
        this.exclude.splice(this.exclude.indexOf(word), 1);
      }
    });
  }

  /**
   * Add words to whitelist filter
   * @param {...string} word - Word(s) to add to whitelist.
   */
  removeWords() {
    this.exclude.push(
      ...Array.from(arguments).map((word) => word.toLowerCase())
    );
  }
}

export default Filter;