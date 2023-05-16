
function showPopupMenu() {
    $(document).keyup(function(e) {
        if (e.key === "Escape") {  // keypress="27
            $('.popup-menu').css('display', 'block');
            $('.popup-menu').css("top", "10%");
            $('.popup-menu').css("right", "25%");
            $('.popup-menu').css("left", "25%");
            $('.popup-menu').addClass("animate__animated animate__bounce");
            $('.container').css('display', 'none');
            window.location.href = "/";
            window.location.reload();
        }
    });
    $(document).ready(function() {
        $('.close').on('click', function(){
            $('.popup-menu').css('display', 'none')
        })
        $('.singleMode').on('click', function () {
            $('.popup-menu').css('display', 'none');
            $('.container').css('display', 'block');
            $('.lobby_container').css('display', 'none');
            $('#h2').text('');
            if (!$('html head').find('script[src="minimax.js"]').length) {
                loadMinimaxScript();
            } else {
                $('script[src="minimax.js"]').remove();
            }
        });
        $('.Multiplayer').on('click', function () {
            $('#h2').css('display', 'block')
            $('.popup-menu').css('display' , 'none')
            {
                $('.popup-menu').css('display', 'none');
            }
            $('.container').css('display', 'block');
            if (!$('html head').find('script[src="multiplayer.js"]').length) {
                loadMultiplayerScript()
                $('.popup-menu').css('display', 'none');


            } else {
                $('script[src="multiplayer.js"]').remove();
            }
        });
    });
    document.addEventListener("DOMContentLoaded", function() {
        $('.container').css("display", "none");
        $('.popup-menu').css("top", "40%");
        $('.popup-menu').css("left", "50%");
    });

}
showPopupMenu();

function loadMinimaxScript() {
    // Check if the script is already loading
    const container = document.querySelector('.field');
    if ($(container).find('table')) {
        $(container).empty();
    }
    const table = document.createElement('table');
    $(table).addClass('table');
    let id = 0;
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            // создаем новую ячейку
            const cell = document.createElement('td');
            $(cell).addClass('cells');
            $(cell).attr('id', id); // add id property
            id++;
            // добавляем ячейку в строку
            row.appendChild(cell);
        }
        // добавляем строку в таблицу
        table.appendChild(row);
    }
    container.appendChild(table);
    $('table').css('border', '5px solid #000')
    const script = document.createElement('script');
    script.setAttribute('src', 'minimax.js');
    /*$('script[src="multiplayer.js"]').remove();*/
    document.head.appendChild(script);
    script.onload = function() {
        startGame();
    };
}

function loadMultiplayerScript() {
    $('.lobby_container').css('display', 'flex');
    const container = document.querySelector('.field');
    if ($(container).find('table')) {
        $(container).empty();
    }
    const table = document.createElement('table');
    $(table).addClass('table');
    let id = 0;
    for (let i = 0; i < 3; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            // создаем новую ячейку
            const cell = document.createElement('td');
            $(cell).addClass('cells');
            $(cell).attr('id', id); // add id property
            id++;
            // добавляем ячейку в строку
            row.appendChild(cell);
        }
        // добавляем строку в таблицу
        table.appendChild(row);
    }
    container.appendChild(table);
    $('table').css('border', '5px solid #000')
    const script = document.createElement('script');
    script.setAttribute('src', 'multiplayer.js');
    /*$('script[src="minimax.js"]').remove();*/
    document.head.appendChild(script);
    script.onload = function() {
        restartGame();
    };
    $('.container').css('display',"none")
}
