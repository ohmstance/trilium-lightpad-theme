# Lightpad - A theme for Trilium Notes
This is my personal theme for Lightpad. I initially modified the default theme to add some padding between elements. Also, I like light themes, so I named this theme "Lightpad". Eventually, it snowballed into this.

This theme tries to make the mobile frontend a bit less finicky. It is also a bit of a hack as it involves major changes to layouts so things will probably break in the future. I don't have a lot of experience with CSS so I'm sorry about the stylesheet file looks 😵.

## Preview
![How it looks like on the desktop software](https://github.com/ohmstance/trilium-lightpad-theme/assets/58171737/3f6d85a1-940d-4dff-81a1-e0c07aadabb6)
![How it looks like on my iPhone 13 Mini](https://github.com/ohmstance/trilium-lightpad-theme/assets/58171737/1930b892-90cc-4a81-8cb1-e1888f2b261d)

## Scrollable launcher pane
> More bookmarks?!

I had to include JS for this as Bootstrap's tooltips and dropdowns in overflowing div needs their boundary changed from parent to window to render properly.

![TriliumLightpadScrollableLauncherPaneDesktop](https://github.com/ohmstance/trilium-lightpad-theme/assets/58171737/8036936d-3c05-4225-a8cd-ba971a10b24a)

## Mobile frontend
I started looking for other note-taking application because the default Trilium theme sucks for mobile use. I decided to stay with Trilium as I like organizing my notes into trees -- so I tried my hand to make Trilium a bit more usable on my phone. 

### Changes
- Moved launcher pane to the top when portrait and made it scrollable.
- Made dropdowns and context menu fullscreen so it's less finicky.
- JS to convert long presses to right click (iOS' Safari doesn't do right click on long-presses at all and Chrome doesn't right click when long-pressing draggable elements like the tree).
- White background Trilium icon for Apple devices as iOS doesn't support transparent icons.
- Fill notch area on iPhone.

https://github.com/ohmstance/trilium-lightpad-theme/assets/58171737/13754e5d-c0ee-42c3-8eb8-c7b5ae272d86

## Installation
1. Go to the releases page and download the zip file.
2. Import into Trilium using "Import into note" in the note tree's context menu.
3. Disable safe import when importing, or alternatively, go through each notes and remove the `*disabled:*` part from their owned attribute.
4. Enable the theme in the "Appearance" settings menu.

## Addendum
If you use Trilium's server instance, be aware I'm using CSS' :has() selector which for Firefox is only supported since December 2023 (Firefox 121) so layout may look wrong. I've only used it for it for quick search and aligning title row in mobile frontend.
