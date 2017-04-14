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
var RingMe = new function() {
  var RING_DOWNLOAD_URL = "https://ring.cx/download";

  var URI_SCHEME_STATE = {
    UNSUPPORTED : 0,
    SUPPORTED : 1,
    UNKNOWN : 2,
    UNCHECKED : 3,
  };

  var nbsp = '\u00A0';

  this.action = null;
  this.buttonLabel = 'Ring' + nbsp + 'Me';
  this.identifier = null;
  this.container = null;
  this.buttonImage = null;
  this.ringUriScheme = "ring:";
  this.ringUriSchemeSupported = URI_SCHEME_STATE.UNCHECKED;
  this.ringUriSchemeSupported = URI_SCHEME_STATE.UNKNOWN;
  this.locale = 'en';

  this.setRingUriSchemeSupport = function(isSupported) {
    this.ringUriSchemeSupported = isSupported;
  }

  this.isRingSchemeSupported = function() {
    if (this.ringUriSchemeSupported === URI_SCHEME_STATE.UNCHECKED) {
      _doCheckRingUriSchemeSupport(this);
    }

    if (this.ringUriSchemeSupported === URI_SCHEME_STATE.SUPPORTED)
      return true;
    else
      return false;
  }

  this.ui = function(UI) {

    if ((UI.action !== undefined) && (UI.action !== null)) {
      this.action = UI.action;
    }
    if ((UI.identifier !== undefined) && (UI.identifier !== null)) {
      this.identifier = UI.identifier;
    }
    if ((UI.container !== undefined) && (UI.container !== null)) {
      this.container = UI.container;
    }
    if ((UI.buttonClass !== undefined) && (UI.buttonClass !== null)) {
      this.buttonClass = UI.buttonClass;
    }
    if ((UI.buttonImage !== undefined) && (UI.buttonImage !== null)) {
      this.buttonImage = UI.buttonImage;
    }
    if ((UI.buttonLabel !== undefined) && (UI.buttonLabel !== null)) {
      this.buttonLabel = UI.buttonLabel;
    }
    if ((UI.lang !== undefined) && (UI.lang !== null)) {
      this.locale = UI.lang;
    }

    var container = document.getElementById(this.container);
    if (!container) {
      console.log(_t(this.locale, 'Received container ID <%s> has not been found in your page.'), this.container);
    }
    else {
      var ringUI = _createRingUI.apply(this);

      container.appendChild(ringUI);
    }
  }

  var _createRingUI = function() {
    var ui;

    ui = _createAnchor.apply(this,
      ['ring:' + this.identifier,
       this.buttonImage ? _createButtonImage(this.buttonImage) :
        document.createTextNode(this.buttonLabel)]
    );

    return ui;
  }

  var _createButtonImage = function(buttonImage) {
    var img = document.createElement('img');
    img.setAttribute('src', buttonImage.src);
    img.setAttribute('alt', buttonImage.alt);
    img.className = 'ring--button--img';

    return img;
  }

  var _createAnchor = function(href, child) {
    var ringUIInstance = this;

    var anchor = document.createElement('a');
    anchor.setAttribute('href', encodeURI(href));
    anchor.className = this.buttonClass || 'btn btn--beta btn--icon sflicon-gauge ring--button btn--download';
    anchor.addEventListener('click', (
      function (event) {
        _ringMeClickEventHandler.apply(
          ringUIInstance,
          [event]
        );
      }
    ));
    anchor.appendChild(child);

    return anchor;
  }

  var _ringMeClickEventHandler = function (event) {
    if (!this.isRingSchemeSupported()) {
      event.preventDefault();
      event.stopPropagation();

      var redirect = confirm(
        _t(
          this.locale,
          "We cannot be sure if you have Ring's latest version.\n" +
          "You might want to download it at <%s>\n\n" +
          "Do you wish to be redirected to Ring's download page?"
        ).replace('%s', RING_DOWNLOAD_URL)
      );

      if (redirect) {
        window.location = encodeURI(RING_DOWNLOAD_URL);
      }
    }
  }

  var _doCheckRingUriSchemeSupport = function(context) {
    _launchUri(
      context.ringUriScheme,
      function() { context.setRingUriSchemeSupport.call(context, URI_SCHEME_STATE.SUPPORTED); },
      function() { context.setRingUriSchemeSupport.call(context, URI_SCHEME_STATE.UNSUPPORTED); },
      function() { context.setRingUriSchemeSupport.call(context, URI_SCHEME_STATE.UNKNOWN); }
    );
  }

  var _t = function(locale, contentKey) {
    return _translations[locale][contentKey];
  }

  var _translations = {
    en: {
      'Ring Me':
        'Ring' + '\u00A0' + 'Me',
      'Received container ID <%s> has not been found in your page.':
        'Received container ID <%s> has not been found in your page.',
      "We cannot be sure if you have Ring's latest version.\nYou might want to download it at <%s>\n\nDo you wish to be redirected to Ring's download page?":
        "We cannot be sure if you have Ring's latest version.\nYou might want to download it at <%s>\n\nDo you wish to be redirected to Ring's download page?"
    },

    fr: {
      'Ring Me':
        'Ring' + '\u00A0' + 'Me',
      'Received container ID <%s> has not been found in your page.':
        'L\'identifiant du conteneur reçu <%s> n\'a pas été trouvé sur cette page.',
      "We cannot be sure if you have Ring's latest version.\nYou might want to download it at <%s>\n\nDo you wish to be redirected to Ring's download page?":
        "Nous ne pouvons être certain que Ring est installé ou que vous utilisez la dernière version.\n" +
        "Vous voulez probablement télécharger la dernière version à l'adresse suivante : <%s>\n\n" +
        "Voulez-vous être redirigé automatiquement vers la page de téléchargement de Ring ?"
    },
  };

  // https://gist.github.com/aaronk6/d801d750f14ac31845e8
  // this function is not under Savoir-faire Linux inc. copyright and license negociation
  // for this code is ongoing here: https://gist.github.com/aaronk6/d801d750f14ac31845e8#gistcomment-1982506
  var _launchUri = function(uri, successCallback, noHandlerCallback, unknownCallback) {
    var res, parent, popup, iframe, timer, timeout, blurHandler, timeoutHandler, browser;

    function callback (cb) {
      if (typeof cb === 'function') cb();
    }

    function createHiddenIframe (parent) {
      var iframe;
      if (!parent) parent = document.body;
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      parent.appendChild(iframe);
      return iframe;
    }

    function removeHiddenIframe(parent) {
      if (!iframe) return;
      if (!parent) parent = document.body;
      parent.removeChild(iframe);
      iframe = null;
    }

    browser = { isChrome: false, isFirefox: false, isIE: false };

    if (window.chrome && !navigator.userAgent.match(/Opera|OPR\//)) {
      browser.isChrome = true;
    } else if (typeof InstallTrigger !== 'undefined') {
      browser.isFirefox = true;
    } else if ('ActiveXObject' in window) {
      browser.isIE = true;
    }

    // Proprietary msLaunchUri method (IE 10+ on Windows 8+)
    if (navigator.msLaunchUri) {
      navigator.msLaunchUri(uri, successCallback, noHandlerCallback);
    }
    // Blur hack (Chrome)
    else if (browser.isChrome) {
      blurHandler = function () {
      window.clearTimeout(timeout);
      window.removeEventListener('blur', blurHandler);
        callback(successCallback);
      };
      timeoutHandler = function () {
      window.removeEventListener('blur', blurHandler);
        callback(noHandlerCallback);
      };
      window.addEventListener('blur', blurHandler);
      timeout = window.setTimeout(timeoutHandler, 500);
      window.location.href = uri;
    }
    // Catch NS_ERROR_UNKNOWN_PROTOCOL exception (Firefox)
    else if (browser.isFirefox) {
      iframe = createHiddenIframe();
      try {
        // if we're still allowed to change the iframe's location, the protocol is registered
        iframe.contentWindow.location.href = uri;
        callback(successCallback);
      } catch (e) {
      if (e.name === 'NS_ERROR_UNKNOWN_PROTOCOL') {
        callback(noHandlerCallback);
      } else {
        callback(unknownCallback);
      }
      } finally {
        removeHiddenIframe();
      }
    }
    // Open popup, change location, check wether we can access the location after the change (IE on Windows < 8)
    else if (browser.isIE) {
      popup = window.open('', 'launcher', 'width=0,height=0');
      popup.location.href = uri;
      try {
        // Try to change the popup's location - if it fails, the protocol isn't registered
        // and we'll end up in the `catch` block.
        popup.location.href = 'about:blank';
        callback(successCallback);
        // The user will be shown a modal dialog to allow the external application. While
        // this dialog is open, we cannot close the popup, so we try again and again until
        // we succeed.
        timer = window.setInterval(function () {
          popup.close();
          if (popup.closed) window.clearInterval(timer);
        }, 500);
      } catch (e) {
        // Regain access to the popup in order to close it.
        popup = window.open('about:blank', 'launcher');
        popup.close();
        callback(noHandlerCallback);
      }
    }
    // No hack we can use, just open the URL in an hidden iframe and invoke `unknownCallback`
    else {
      iframe = createHiddenIframe();
      iframe.contentWindow.location.href = uri;
      window.setTimeout(function () {
        removeHiddenIframe(parent);
        callback(unknownCallback);
      }, 500);
    }
  }
}

module.exports = RingMe;
