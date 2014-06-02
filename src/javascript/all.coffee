j11 = jQuery.noConflict true
j11.blockUI.defaults.css = cursor: 'auto'

# control function

bane =
    'metal': 'wood'
    'wood': 'earth'
    'earth': 'water'
    'water': 'fire'
    'fire': 'metal'
translate =
    'metal': '金'
    'wood': '木'
    'earth': '土'
    'water': '水'
    'fire': '火'
calcu = j11 '.calcu'
select_career = j11 '#select_career'
select_attr = j11 '#select_attr'
point = j11 '#point'
menu = j11 '#menu'

opposite = (child) ->
    if j11('#half_left').has(child).length then '#half_right' else '#half_left'

sameside = (child) ->
    if j11('#half_left').has(child).length then '#half_left' else '#half_right'

target = null

pop_widget = (wid) -> (e) ->
    # TODO: set widget position
    target = j11 e.target
    target.css('z-index', 1011)
    wid.css('opacity', 0)
    j11.blockUI
        message: wid
        onOverlayClick: j11.unblockUI
        onBlock: ->
            if wid.hasClass 'calcu'
                wid.removeClass 'for-hp for-sp'
                output.text target.text()
                if target.hasClass 'hp'
                    wid.addClass 'for-hp'
                else if target.hasClass 'sp'
                    wid.addClass 'for-sp'

            if target.hasClass 'pop-mid'
                wid.removeClass 'for-star for-env for-pet'
                if target.hasClass 'star'
                    wid.addClass 'for-star'
                else if target.hasClass 'env'
                    target = env
                    wid.addClass 'for-env'
                else if target.hasClass 'pet'
                    wid.addClass 'for-pet'
                wid.parent().position
                    my: 'top'
                    at: 'top+5%'
                    of: j11 '.blockOverlay'
            else if wid.is point
                wid.height(target.outerHeight() + wid.children().outerHeight() * 2)
                wid.parent().position
                    of: target
            else
                wid.parent().position
                    of: opposite(target)
            wid.css('opacity', 1)
        onUnblock: ->
            target.css('z-index', 0)
            target = null

hp = (j11 '.hp').click pop_widget calcu
sp = (j11 '.sp').click pop_widget calcu
profession = (j11 '.profession').click pop_widget select_career
pet = (j11 '.pet').click pop_widget select_attr
petnum = (j11 '.pet-num').click pop_widget point
dark = (j11 '.dark').click pop_widget point
star = (j11 '.star').click pop_widget select_attr
env = (j11 '#env').click pop_widget select_attr
envtxt = (j11 '#envtxt').click pop_widget select_attr
tools = (j11 '#tools').click pop_widget menu

change_attr = (obj, attr) ->
    obj.removeClass('metal wood water fire earth').addClass attr

getCookie = (name) ->
    document.cookie.match(name + '=\\w+')?[0].split('=')[1]

initialize = ->
    hp.text (getCookie 'hp_point') ? 250
    sp.text ''
    profession.text '無職業'
    pet.children().attr class: ''
    petnum.text ''
    dark.text ''
    star.children().attr class: ''
    env.children().attr class: ''
    change_attr(envtxt, '').text '無'
    j11('.meteor .spawn').removeClass('spawn').children().fadeTo 'slow', 0.5

spawnstar = (div, attr) ->
    if not div.hasClass attr
        op = j11(opposite(div) + ' .star div')
        opattr = op.attr 'class'
        if bane[attr] is opattr
            op.attr class: ''
        if attr isnt opattr or not attr
            div.attr class: attr
            true
        else
            false
    else
        false

output = j11 '.output', calcu
operator =
    '+': (a, b) -> Number(a) + Number b
    '-': (a, b) -> a - b
    '*': (a, b) -> a * b
    '/': (a, b) -> a // b
    '**': (a, b) -> a ** b
calculate = (s) ->
    m = s.match(/\d+|[\+\*\/-]+/g) ? []
    if m.length is 3
        operator[m[1]] m[0], m[2]
    else if s
        Number s
    else
        ''

(j11 '.num', calcu).click (e) -> output.append e.target.innerText
(j11 '.op', calcu).click (e) ->
    result = calculate output.text()
    unless isNaN result
        output.text result + e.target.innerText
    else
        output.append e.target.innerText
(j11 '.enter', calcu).click (e) ->
    result = calculate output.text()
    output.text result
    target.text(result) unless isNaN result
    j11.unblockUI()

(j11 '.btn-danger', calcu).click (e) -> output.text target.text()
(j11 '.btn-default', calcu).click (e) -> output.text output.text()[...-1]

j11('.meteor > div').click ->
    self = j11(@)
    if self.hasClass 'spawn'
        self.removeClass('spawn').children().fadeTo 'slow', 0.5
    else
        self.addClass('spawn').children().fadeTo 'slow', 1 if spawnstar j11(sameside(self) + ' .star div'), self.children().attr 'class'

select_attr.find('.btn').click (e) ->
    div = target.children()
    attr = (j11 e.target).attr 'data-attr'
    if target.hasClass 'star'
        spawnstar div, attr
    else
        div.attr class: attr
    if target.hasClass 'pet'
        if attr
            target.next().text 2
        else
            target.next().text ''
    else if target.hasClass 'env'
        change_attr(envtxt, attr).text translate[attr] ? '無'

select_career.find('a').click (e) ->
    e.preventDefault()
    self = j11 e.target
    target.text self.text()

(j11 '#point .add').click ->
    n = Number target.text()
    if not n
        target.text 1
    else if n < 8
        target.text n + 1
(j11 '#point .cut').click ->
    n = Number target.text()
    if 1 < n
        target.text n - 1
    else
        target.text ''
    if not target.text() and target.hasClass 'pet-num'
        target.prev().children().attr class: ''

(j11 '#initi').click initialize
(j11 '#save_setting').click ->
    v = (j11 '#formhp').val()
    document.cookie = 'hp_point=' + v if v

# prevent bootstrap modal from steal focus.
(j11 '#setwindow *').bind 'click mouseup mousedown keypress keydown keyup', (e) ->
    e.stopPropagation() if e.which isnt 27 and not (j11 e.target).hasClass 'btn'

# appearance adjustment

tools.popover content: '''Please turn to landscape mode!
請將螢幕橫置瀏覽！'''
detectPortrait = ->
    if innerWidth < innerHeight
        tools.popover 'show'
    else
        tools.popover 'hide'
j11(window).resize detectPortrait
detectPortrait()

# keyboard support
