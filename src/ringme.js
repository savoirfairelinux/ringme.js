/*
 * Copyright © 2017 Savoir-faire Linux Inc.
 *
 * This file is part of ringme.js.
 *
 * ringme.js is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ringme.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ringme.js.  If not, see <http://www.gnu.org/licenses/>.
 */
const RingMe = new function () {
  const RING_DOWNLOAD_URL = 'https://ring.cx/download'

  const URI_SCHEME_STATE = {
    UNSUPPORTED: 0,
    SUPPORTED: 1,
    UNKNOWN: 2,
    UNCHECKED: 3
  }

  const nbsp = '\u00A0'

  this.action = null
  this.buttonLabel = 'Ring' + nbsp + 'Me'
  this.identifier = null
  this.container = null
  this.buttonImage = null
  this.ringUriScheme = 'ring:'
  this.ringUriSchemeSupported = URI_SCHEME_STATE.UNCHECKED

  this.setRingUriSchemeSupport = function (isSupported) {
    this.ringUriSchemeSupported = isSupported
  }

  this.isRingSchemeSupported = function () {
    if (this.ringUriSchemeSupported === URI_SCHEME_STATE.UNCHECKED) {
      _doCheckRingUriSchemeSupport(this)
    }

    if (this.ringUriSchemeSupported === URI_SCHEME_STATE.SUPPORTED) { return true } else { return false }
  }

  this.ui = function (UI) {
    if ((UI.action !== undefined) && (UI.action !== null)) {
      this.action = UI.action
    }
    if ((UI.identifier !== undefined) && (UI.identifier !== null)) {
      this.identifier = UI.identifier
    }
    if ((UI.container !== undefined) && (UI.container !== null)) {
      this.container = UI.container
    }
    if ((UI.buttonClass !== undefined) && (UI.buttonClass !== null)) {
      this.buttonClass = UI.buttonClass
    }
    if ((UI.buttonImage !== undefined) && (UI.buttonImage !== null)) {
      this.buttonImage = UI.buttonImage
    }
    if ((UI.buttonLabel !== undefined) && (UI.buttonLabel !== null)) {
      this.buttonLabel = UI.buttonLabel
    }

    const container = document.getElementById(this.container)
    if (!container) {
      console.log('Received container ID <' + this.container + '> has not been found in your page.')
    } else {
      const ringUI = _createRingUI.apply(this)

      container.appendChild(ringUI)
    }
  }

  const _createRingUI = function () {
    let ui = _createAnchor.apply(this,
      ['ring:' + this.identifier,
        this.buttonImage ? _createButtonImage(this.buttonImage)
          : document.createTextNode(this.buttonLabel)]
    )

    ui = _styleButton(ui)

    return ui
  }

  const _createButtonImage = function (buttonImage) {
    const img = document.createElement('img')
    img.setAttribute('src', buttonImage.src)
    img.setAttribute('alt', buttonImage.alt)
    img.className = 'btn--ring--img'

    return img
  }

  const _styleButton = function (button) {
    const box =
      'border-radius: 6px;' +
      'padding: 3px 23px 3px 46px;'
    const genericBackground =
      'background-color: #3bc1d3;'
    const dualBackground =
      'background: ' +
        'url(../assets/ring-logo_white.png) 6px center / 20px 20px no-repeat,' +
        'linear-gradient(to right, #3bc1d3, #3bc1d3) left top / 32px auto repeat-y,' +
        'linear-gradient(to right, #75d3e0, #75d3e0) 23px top / 20px auto repeat;'
    const text =
      'color: #fff;' +
      'font-family: Georgia, Cambria, "Times New Roman", Times, serif;' +
      'font-weight: bold;' +
      'text-decoration: none;'

    const styledButton = button
    styledButton.setAttribute('style', box + genericBackground + dualBackground + text)

    return styledButton
  }

  const _createAnchor = function (href, child) {
    const ringUIInstance = this

    const anchor = document.createElement('a')
    const anchorURI = encodeURI(href)
    anchor.setAttribute('href', anchorURI)
    anchor.className = this.buttonClass || 'btn btn--ringme'
    anchor.addEventListener('click',
      function (event) {
        event.preventDefault()
        event.stopPropagation()

        if (!ringUIInstance.isRingSchemeSupported()) {
          window.setTimeout(function () {
            _ringMeClickEventHandler.apply(
              ringUIInstance,
              [event])
          }, 600)
        } else {
          window.location = anchorURI
        }
      }
    )
    anchor.appendChild(child)

    return anchor
  }

  const _ringMeClickEventHandler = function () {
    if (!this.isRingSchemeSupported()) {
      const redirect = confirm(
        "We cannot be sure if you have Ring's latest version.\n" +
        'You might want to download it at ' + RING_DOWNLOAD_URL + '\n\n' +
        "Do you wish to be redirected to Ring's download page?"
      )

      if (redirect) {
        window.location = encodeURI(RING_DOWNLOAD_URL)
      }
    }
  }

  const _doCheckRingUriSchemeSupport = function (context) {
    _launchUri(
      context.ringUriScheme,
      function () { context.setRingUriSchemeSupport.bind(context)(URI_SCHEME_STATE.SUPPORTED) },
      function () { context.setRingUriSchemeSupport.bind(context)(URI_SCHEME_STATE.UNSUPPORTED) },
      function () { context.setRingUriSchemeSupport.bind(context)(URI_SCHEME_STATE.UNKNOWN) }
    )
  }

  /*!
   * Copyright © 2015 aaronk6
   * https://gist.github.com/aaronk6/d801d750f14ac31845e8
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */
  var _launchUri = function (uri, successCallback, noHandlerCallback, unknownCallback) {
    var parent, popup, iframe, timer, timeout, blurHandler, timeoutHandler, browser

    function callback (cb) {
      if (typeof cb === 'function') cb()
    }

    function createHiddenIframe (parent) {
      var iframe
      if (!parent) parent = document.body
      iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      parent.appendChild(iframe)
      return iframe
    }

    function removeHiddenIframe (parent) {
      if (!iframe) return
      if (!parent) parent = document.body
      parent.removeChild(iframe)
      iframe = null
    }

    browser = { isChrome: false, isFirefox: false, isIE: false }

    if (window.chrome && !navigator.userAgent.match(/Opera|OPR\//)) {
      browser.isChrome = true
    } else if (typeof InstallTrigger !== 'undefined') {
      browser.isFirefox = true
    } else if ('ActiveXObject' in window) {
      browser.isIE = true
    }

    // Proprietary msLaunchUri method (IE 10+ on Windows 8+)
    if (navigator.msLaunchUri) {
      navigator.msLaunchUri(uri, successCallback, noHandlerCallback)
    } else if (browser.isChrome) { // Blur hack (Chrome)
      blurHandler = function () {
        window.clearTimeout(timeout)
        window.removeEventListener('blur', blurHandler)
        callback(successCallback)
      }
      timeoutHandler = function () {
        window.removeEventListener('blur', blurHandler)
        callback(noHandlerCallback)
      }
      window.addEventListener('blur', blurHandler)
      timeout = window.setTimeout(timeoutHandler, 500)
      window.location.href = uri
    } else if (browser.isFirefox) { // Catch NS_ERROR_UNKNOWN_PROTOCOL exception (Firefox)
      iframe = createHiddenIframe()
      try {
        // if we're still allowed to change the iframe's location, the protocol is registered
        iframe.contentWindow.location.href = uri
        callback(successCallback)
      } catch (e) {
        if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
          callback(noHandlerCallback)
        } else {
          callback(unknownCallback)
        }
      } finally {
        removeHiddenIframe()
      }
    } else if (browser.isIE) { // Open popup, change location, check wether we can access the location after the change (IE on Windows < 8)
      popup = window.open('', 'launcher', 'width=0,height=0')
      popup.location.href = uri
      try {
        // Try to change the popup's location - if it fails, the protocol isn't registered
        // and we'll end up in the `catch` block.
        popup.location.href = 'about:blank'
        callback(successCallback)
        // The user will be shown a modal dialog to allow the external application. While
        // this dialog is open, we cannot close the popup, so we try again and again until
        // we succeed.
        timer = window.setInterval(function () {
          popup.close()
          if (popup.closed) window.clearInterval(timer)
        }, 500)
      } catch (e) {
        // Regain access to the popup in order to close it.
        popup = window.open('about:blank', 'launcher')
        popup.close()
        callback(noHandlerCallback)
      }
    } else { // No hack we can use, just open the URL in an hidden iframe and invoke `unknownCallback`
      iframe = createHiddenIframe()
      iframe.contentWindow.location.href = uri
      window.setTimeout(function () {
        removeHiddenIframe(parent)
        callback(unknownCallback)
      }, 500)
    }
  }
}()

module.exports = RingMe
