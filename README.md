![ring-logo](./assets/Logo.scale-100.png) RingMe.js
=====

A library to render a `Ring Me` button on your website. The _best way_ to bring Ring communication to your website!

What is Ring
-----

> Ring is free software for universal communication which respects freedoms and privacy of its users.

[See official Ring website to _join the Ring_](https://ring.cx/)

Communication
-----

The easiest way to [communicate with us is by opening a new issue](https://github.com/savoirfairelinux/ringme.js/issues/new).
Make sure you add proper labels to your issue (e.g. question, issue, enhancement, …)

Usage
-----

### Why you don't need it

This project does nothing except proposing a default look & feel for a
`Ring Me` button that you can add to any web page _easily_.

You could simply choose to not use this Javascript project and add a
link on your page like so:

`<a href="ring:my-ring-ID">Call me with Ring, a communication tool that
respects your freedoms and privacy</a>`

as you would add a link on your page to let your visitors email you:

`<a href="mailto:my-email@example.com">Email me!</a>`

The magic happens through the Ring client that configures your computer
to handle the `ring:` scheme.

### Why you need it

Since Ring clients are not spread as much as email clients (yet), this
little project helps in identifying if `ring:` scheme can be handled by
the visitor of a web page.

It also propose a unified look & feel for a `Ring me` button that will
be recognized (soon enough) by visitors.

Installation
-----

This is still in pre-alpha state. No installation process yet and needed
feature in Ring's clients might not yet be available in released branch.

Sure thing though, you should want to use this library from a server
you control and prefer a _self-hosted_ solution on your website instead
of pointing to a <abbr title="Content delivery network">CDN</abbr> in
order to avoid a _call home_ feature that wouldn't necessary respect
your privacy.

This section will be updated with proper information as soon as this becomes robust and stable.

How to contribute
-----

Please refer to the [contribution guidelines](https://github.com/savoirfairelinux/ringme.js/blob/master/CONTRIBUTING.md)

Licensing
-----

Ringme.js is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ringme.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received [a copy of the GNU General Public License](https://github.com/savoirfairelinux/ringme.js/blob/master/COPYING)
along with ringme.js.  If not, see <http://www.gnu.org/licenses/>.

 _with &hearts; from **[Savoir-faire Linux](https://www.savoirfairelinux.com/)**_
