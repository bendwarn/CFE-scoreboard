j11 = jQuery.noConflict true
j11.blockUI.defaults.css = cursor: 'auto'

# control function

hp_point = [250, 250]
sp_point = [0, 0, 0, 0]
pet_point = [0, 0, 0, 0]
dark_point = [0, 0]
calcu = j11 '.calcu'
select_career = j11 '#select_career'
select_attr = j11 '#select_attr'
point = j11 '#point'
menu = j11 '#menu'

opposite = (child) ->
    if j11('#half_left').has(child).length then '#half_right' else '#half_left'

target = null

pop_widget = (wid) -> (e) ->
    # TODO: set widget position
    target = self = j11 e.target
    self.css('z-index', 1011)
    wid.css('opacity', 0)
    j11.blockUI
        message: wid
        onOverlayClick: ->
            j11.unblockUI()
            target = null
            self.css('z-index', 0)
        onBlock: ->
            if wid.hasClass 'calcu'
                wid.removeClass('for-hp').removeClass 'for-sp'
                if self.hasClass 'hp'
                    wid.addClass 'for-hp'
                else if self.hasClass 'sp'
                    wid.addClass 'for-sp'

            if self.hasClass 'pop-mid'
                console.log self
                wid.removeClass('for-star').removeClass('for-env').removeClass 'for-pet'
                if self.hasClass 'star'
                    wid.addClass 'for-star'
                else if self.hasClass 'env'
                    wid.addClass 'for-env'
                else if self.hasClass 'pet'
                    wid.addClass 'for-pet'
                wid.parent().position
                    my: 'top'
                    at: 'top+5%'
                    of: j11 '.blockOverlay'
            else if wid.is point
                wid.height(self.height() + wid.children().height() * 2)
                wid.parent().position
                    of: self
            else
                wid.parent().position
                    of: opposite(self)
            wid.css('opacity', 1)

hp = (j11 '.hp').click pop_widget calcu
sp = (j11 '.sp').click pop_widget calcu
profession = (j11 '.profession').click pop_widget select_career
pet = (j11 '.pet').click pop_widget select_attr
petnum = (j11 '.pet-num').click pop_widget point
dark = (j11 '.dark').click pop_widget point
star = (j11 '.star').click pop_widget select_attr
env = (j11 '#env').click pop_widget select_attr
(j11 '#envtxt').click pop_widget select_attr
tools = (j11 '#tools').click pop_widget menu

# keyboard support
