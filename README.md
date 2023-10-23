# slowdown
A Web Extension that adds deliberate loading times to potentially-distracting sites

# Why?

Convenience makes distractions easier. This extension gives you time to reflect and be more deliberate about how you spend your time.

# What works so far

Go to a distracting site and click the Slowdown extension button, then click "Add site". Now the extension will display a "Loading..." dialog whenever you load or navigate around that site.

If you find yourself mindlessly clicking a distracting link, you can click "Cancel" to go back to the page you were on.

# Installing

(This is currently in a functional-but-still-rough state, so it's not published on extension stores yet.)

To install in Chrome:

1. Download the source code
2. Go to "Manage extensions"
3. Turn on "Developer mode"
4. Click "load unpacked"
5. Open the Slowdown source code directory (the directory containing the `manifest.json`)

# TODO list

- [x] bare minimum functionality
- [x] can click "cancel" to go back
- [x] Verify it works in SPAs
- [x] disable "cancel" button before new page loads
- [x] don't display loading dialog immediately after clicking "cancel"
- [ ] add button to remove from a site
- [ ] random variation in loading time
- [ ] styling
- [ ] icons
- [ ] display your current [Trickle](https://trickle.danmercer.net/) task in an iframe
