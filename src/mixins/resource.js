import Constants from '@/config/constants'
import Strings from '@/config/Strings'

export default {
  dhm: function (t) {
    var cd, ch, d, h, m
    cd = 24 * 60 * 60 * 1000
    ch = 60 * 60 * 1000
    d = Math.floor(t / cd)
    h = Math.floor((t - d * cd) / ch)
    m = Math.round((t - d * cd - h * ch) / 60000)
    if (m === 60) {
      h++
      m = 0
    }
    if (h === 24) {
      d++
      h = 0
    }
    return [d, h, m]
  },
  timer: function (period) {
    var output
    for (var i = 0; i < period.length; i++) {
      if (period[i] > 0 && i === 0) {
        output = period[i] + ' days ago'
        break
      } else if (period[i] > 0 && i === 1) {
        output = period[i] + ' hours ago'
        break
      } else if (i === 2) {
        output = period[i] + ' minuites ago'
        break
      }
    }
    return output
  },
  errorHandler: function (response, event) {
    console.log(event, response)
  },
  prepareStringForURL: function (value) {
    return value
                .trim()
                .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/\s]/gi, '-')
  },
  getNWordsFromString: function (value, noOfWords) {
    return value
            .split(/\s+/)
            .slice(0, noOfWords)
            .join(' ') + '...'
  },
  setPageTitle: function (title) {
    document.title = 'DataGlitter - ' + title
  },
  setPageAuthor: function (author) {
    $('meta[name=author]').attr('content', author)
  },
  setPageTags: function (tags) {
    var localTags = Constants.PTAGS
    localTags = localTags.concat(tags)
    localTags = localTags.concat(Constants.TAGS)
    $('meta[name=keywords]').attr('content', localTags.join())
  },
  setPageDescription: function (description) {
    $('meta[name=description]').attr('content', description)
  },
  getNameOfCategory: function (catId) {
    var categoryName
    for (var i = 0; i < Strings.CATEGORIES.length; i++) {
      if (Strings.CATEGORIES[i]['code'] === catId) {
        categoryName = Strings.CATEGORIES[i]['name']
        break
      }
    }
    return categoryName
  }
}
