#GMScreen ([demo](http://ryankinal.github.com/GMScreen/))

GMScreen IS a fully customizable dashboard for tables, lists, and notes targeted at Pencil-and-Paper (or, more likely, computer-pencil-and-paper) RPG game masters, story-tellers, and dungeon-masters.

Besides require.js, all code is my own.

##Recent Additions

Some cool features that have recently been added!

###Dice - 12/22

When editing an item, use `roll(dice, flags)`. Here's what that all means:

**dice** is, of course, any dice and bonuses you need. Some examples:

* `1d20+5`
* `4d6`
* `1d8+1d6`

**flags** let you modify how the dice work. It's any combination of the following:</p>

* **v** &ndash; show the results of every die rolled, as well as the total. Will output something like `25 (20)` or `16 (5, 2, 3, 6)`
* **t{number}** &ndash; this will base the total on a &quot;threshold&quot; number. It will count the number of dice that came up with a result of {number} or better.

Some examples:

* `roll(5d6, t5)` might output `3` if the dice came up `4, 5, 3, 6, 5`
* `roll(5d6, vt5)` would output `3 [4, 5, 3, 6, 5]`

Once a die has been rolled, you'll only see the output when you try to edit that item again.

###Hotkeys - 12/18

The way hotkeys work has been changed to be simpler, and cross-browser. These hotkeys will work any time you're not typing in a text input or a textarea. No modifier keys, and no activation keys.

* Hit `w` to add a window to the current screen
* Hit `s` to add a new screen
* Hit `Esc` to close any modal window

###Local Storage - 12/8

Whenever you do *anything* it is immediately saved to your browser. This includes:

* Adding a new screen
* Adding a new window
* Moving a window
* Shading a window
* Adding and editing table rows and columns
* Adding and editing list items
* Sorting tables
* Moving list items
* Marking list items and table rows
* Deleting list items and table rows
* **Basically anything you do**

And, when you return to the page, your changes will be loaded for you.

###Improved marking - 12/8

I've improved the way data is represented in tables and lists, so a marked row or item will remain marked when sorting and moving.

More of these to come eventually!

##Future Features

Awesome stuff that will be available in the future

###Cloud Storage

This will mean that everything that saves in your browser will also (optionally) be stored on a server. You'll be able to switch from device to device and still have access to all your screens, but it will require an account.

###More Hotkeys

Yep.

###Dice

Yep

##Licensing

This work is licensed under [WTFPL](http://sam.zoy.org/wtfpl/)

              DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                        Version 2, December 2004 

     Copyright (C) 2004 Sam Hocevar <sam@hocevar.net> 

     Everyone is permitted to copy and distribute verbatim or modified 
     copies of this license document, and changing it is allowed as long 
     as the name is changed. 

                DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
      TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 

      0. You just DO WHAT THE FUCK YOU WANT TO. 