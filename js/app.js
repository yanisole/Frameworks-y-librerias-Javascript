'use strict';

var _maxRows = 7, _maxColumns = 7, _minCombinationSize = 3, _maxDistance = 30;
var _combinationTimerId = 0, _refillTimerId = 0, _clockId = 0;
var _width1 = 0, _width2 = 0, _timerId = 0;
var _onFadeToggleAnimation = {};
var _lock = false, _endAnimationSource = false, _endAnimationTarget = false;

//============Animación del título==========
//Decr: Cambia el color del título a blanco
function titleAnimationWhite(){
    $('.main-titulo').switchClass('main-titulo', 'main-titulo-2', 700, 'swing', function(){
        titleAnimationYellow();
    });
}

//Decr: Cambia el color del título a amarillo
function titleAnimationYellow(){
    $('.main-titulo-2').switchClass('main-titulo-2', 'main-titulo', 900, 'swing', function(){
        titleAnimationWhite();
    });
}
//==========Fin Animación del título========

//========Swap de caramelos======
//Descr: Dice si un elemento puede moverse a esa posición
function canMove(p_column, p_row, p_element, p_direction){
    var w_left = { count: 0, array: [] }, w_right = { count: 0, array: [] };
    var w_up = { count: 0, array: [] }, w_down = { count: 0, array: [] };
    var w_verticalSize = 0, w_horizontalSize = 0;
    
    switch(p_direction){
        case 'left':
            w_left = scanLeft(p_column, p_row, p_element);
            w_up = scanUp(p_row, p_column, p_element);
            w_down = scanDown(p_row, p_column, p_element);
            break;
        case 'right':
            w_right = scanRight(p_column, p_row, p_element);
            w_up = scanUp(p_row, p_column, p_element);
            w_down = scanDown(p_row, p_column, p_element);
            break;
        case 'down':
            w_left = scanLeft(p_column, p_row, p_element);
            w_right = scanRight(p_column, p_row, p_element);
            w_up = scanUp(p_row, p_column, p_element);
            break;
        default:
            w_left = scanLeft(p_column, p_row, p_element);
            w_right = scanRight(p_column, p_row, p_element);
            w_down = scanDown(p_row, p_column, p_element);
            break;

    }
    w_verticalSize = w_up.count + w_down.count + 1;
    w_horizontalSize = w_left.count + w_right.count + 1;
    console.log(Math.max(w_verticalSize, w_horizontalSize));
 
    return Math.max(w_verticalSize, w_horizontalSize) >= _minCombinationSize;
}

//Descr: Cancela el intento de intercambio
function cancelSwap(p_source, p_distance, p_direction, p_callback){
    var w_forward = 15, w_backward = (15 + p_distance), w_speed = 500;
    var w_sourceForward = {}, w_sourceBackward = {};    
        
    //Determino en que dirección debo mover las fichas
    if(p_direction.orientation === 'vertical'){
        if(p_direction.direction === 'down'){ 
            w_sourceForward = { top: '+=' + w_forward };
            w_sourceBackward = { top: '-=' + w_forward };
        } else {
            w_sourceForward = { top: '-=' + w_forward };
            w_sourceBackward = { top: '+=' + w_forward };
        }
    } else {
        if(p_direction.direction === 'right'){
            w_sourceForward = { left: '+=' + w_forward };
            w_sourceBackward = { left: '-=' + w_forward };
        } else {
            w_sourceForward = { left: '-=' + w_forward };
            w_sourceBackward = { left: '+=' + w_forward };
        }        
    }
    
    p_source.css('position', 'relative');   
    p_source.animate(
        w_sourceForward,
        w_speed,
        function(){            
            p_source.animate(
                w_sourceBackward,
                w_speed,
                function(){
        })
    });
}

//Descr: Intercambia dos dulces
function swap(p_source, p_target, p_direction, p_callback){
    var w_sourcePos = p_source.position(), w_targetPos = p_target.position();
    var w_offset = 0, w_speed = 500;
    var w_sourceForward = {}, w_sourceBackward = {}, w_targetForward = {}, w_targetBackward = {};    
    var w_valueSource = getCandyData(p_source).element, w_valueTarget = getCandyData(p_target).element;
        
    _endAnimationSource = false;
    _endAnimationTarget = false;
    //Determino en que dirección debo mover las fichas
    if(p_direction.orientation === 'vertical'){
        if(p_direction.direction === 'down'){ 
            w_offset = Math.floor((w_targetPos.top - w_sourcePos.top) / 2);
            w_sourceForward = { top: '+=' + w_offset };
            w_sourceBackward = { top: '-=' + w_offset };
            w_targetForward =  w_sourceBackward;
            w_targetBackward = w_sourceForward;
        } else {
            w_offset = Math.floor((w_sourcePos.top - w_targetPos.top) / 2);
            w_sourceForward = { top: '-=' + w_offset };
            w_sourceBackward = { top: '+=' + w_offset };
            w_targetForward = w_sourceBackward;
            w_targetBackward = w_sourceForward;
        }
    } else {
        if(p_direction.direction === 'right'){
            w_offset = Math.floor((w_targetPos.left - w_sourcePos.left) / 2);
            w_sourceForward = { left: '+=' + w_offset };
            w_sourceBackward = { left: '-=' + w_offset };
            w_targetForward = w_sourceBackward;
            w_targetBackward = w_sourceForward;
        } else {
            w_offset = Math.floor((w_sourcePos.left - w_targetPos.left) / 2);
            w_sourceForward = { left: '-=' + w_offset };
            w_sourceBackward = { left: '+=' + w_offset };
            w_targetForward = w_sourceBackward;
            w_targetBackward = w_sourceForward;
        }        
    }
    
    p_source.css('position', 'relative');
    p_source.css('z-index', '1000');

    p_target.css('position', 'relative');
    p_target.css('z-index', '500');

    _timerId = setInterval(function(){
        if(!_endAnimationSource || !_endAnimationTarget)
            return;
        
        clearInterval(_timerId);
        if(p_callback)
            p_callback();
    }, 200);
   
    p_source.animate(
        w_sourceForward,
        w_speed,
        function(){
            p_source.attr('data-candy', w_valueTarget);
            p_source.attr('src', 'image/' + w_valueTarget);
            p_source.css('z-index', '500');
            p_source.animate(
                w_sourceBackward,
                w_speed,
                function(){
                    p_source.css('z-index', '');
                    _endAnimationSource = true;
        })
    });

    p_target.animate(
        w_targetForward,
        w_speed,
        function(){
            p_target.attr('data-candy', w_valueSource);
            p_target.attr('src', 'image/' + w_valueSource);
            p_target.css('z-index', '1000');
            p_target.animate(
                w_targetBackward,
                w_speed,
                function(){
                    p_target.css('z-index', '');
                    _endAnimationTarget = true;
        })
    });

}
//======Fin Swap de caramelos====

//============Animaciones de movimiento de ficha==========
//Descr: Lanza un dulce nuevo a la grilla
function dropCandyArray(p_array){
    var w_candy = null, w_data = null, w_arrayImg = null;
    var w_columnElement = null;
    var w_row = 0;
    var w_id = 0;
    
    if(p_array.length == 0)
        return;
    
    w_candy = p_array.pop();
    w_data = getCandyData(w_candy);    
    w_candy.show();
    w_columnElement = getColumn(w_data.column);
    w_columnElement.prepend(w_candy);
        
    w_candy.addClass('dulce');    
    w_candy.css('top', '-' + (w_data.row * 112) + 'px');
    w_candy.animate({
        top:  '+=96',
        height: 'toogle'       
    }, 
    100,
    function(){
        w_candy.removeClass('dulce');
        w_candy.css('top', '');    
        
        dropCandyArray(p_array, w_columnElement); 
        if(p_array.length === 0){
            //Actualizo los datos de los dulces
            refreshGridData();
            _lock = false;
        }
    });
}
//==========Fin Animaciones de movimiento de ficha========

//==========Dulces========
//Descr: Genera un dulce. Valores posibles:
//1.png, 2.png, 3.png, 4.png
function generateCandyElement(){    
    var w_candy = generateCandy();
    var w_src = 'image/' + w_candy;
    return $('<img />').attr({
        'src': w_src,
        'class': 'elemento',
        'data-candy': w_candy
    });
}

//Decsr: Genera un dulce. Valores posibles:
//1.png, 2.png, 3.png, 4.png
function generateCandy(){
    var w_idx = rollDice(4) + 1;
    return String(w_idx) + '.png';
}

//Descr: Genera el Id para un dulce
//p_column => Índice de la columna.
//p_row => Índice de la fila.
function generateCandyId(p_column, p_row){
    return 'candy-C' + String(p_column) + 'R' + String(p_row);
}

//Descr: Obtiene el id de un dulce
//p_candyObj => Objeto del DOM
function getCandyId(p_candyObj){
    return p_candyObj.attr('id');
}

//Descr: Devuelve el nombre del dulce
//p_imgDOM => Objeto del DOM que contiene la imágen del dulce.
function getCandyName(p_column, p_row){
    var w_candy = getCandy(p_column, p_row);
    return w_candy.attr('data-candy');
}

//Descr: Devuelve el objeto del dom con el dulce
function getCandy(p_column, p_row){
    var w_id = '#' + generateCandyId(p_column, p_row);
    return $(w_id);
}

//Descr. Devuelve información sobre el dulce
//p_candy => Objeto del DOM
function getCandyData(p_candy){ 
    return {
        id: p_candy.attr('id'),
        element: p_candy.attr('data-candy'),
        row: Number(p_candy.attr('data-row')),
        column: Number(p_candy.attr('data-col'))        
    }
}

//Descr: Agrega un dulce en una determinada posición
//de la grilla
function addCandyToColumn(p_column, p_row){
    var w_candy = generateCandyElement();
    var w_colDOM = null;
    var w_id = '';

    //Le asigno el id al dulce
    w_id = generateCandyId(p_column, p_row);
    w_candy.attr({
        'id': w_id,
        'data-row': p_row,
        'data-col': p_column
    });   
    w_candy.css('position', 'relative');

    w_colDOM = getColumn(p_column);
    w_colDOM.append(w_candy);    

    return w_candy;
}
//========Fin Dulces======

//Descr: Se calculan los puntos obtenidos por la combinación
//Se usa una fórmula secilla. 
function calculatePoints(p_combinationSize){
    var w_minPoints = 10;
    var w_rem = Math.ceil(p_combinationSize / _minCombinationSize);
    var w_points = w_minPoints * w_rem;
    var w_score = Number($('#score-text').html()) + w_points;

    $('#score-text').html(w_score);
}

//Decr: Devuelve un entero entre 0 y p_max - 1.
//p_max => Límite máximo
function rollDice(p_max){
    return (Math.floor(Math.random() * p_max));
 }

//==========Grilla========
//Descr: Inicializa la grilla
function initGrid(){
    var w_col = 0, w_row = 0;   

    clearGrid();
    for(var w_col = 1; w_col <= _maxColumns; w_col++){        
        for(var w_row = _maxRows; w_row > 0; w_row--){
            addCandyToColumn(w_col, w_row);
        }   
    }

    _combinationTimerId = setInterval(scanCombinations, 300);
    _refillTimerId = setInterval(refillGrid, 500);
}

//Descr: Limpia la grilla
function clearGrid(){
    $('div[class^="col-"').html('');
}

//Descr: Genera dulces para completar la grilla
//en los espacios vacíos
function refillGrid(){
    var w_col = 0, w_difference = 0;
    var w_candy = null, w_colDOM = null;
    var w_array = [], w_arrayImg = [];
    
    try{
        if(_lock || $('img[id^=candy-]').length  == _maxColumns * _maxRows)
            return;

        _lock = true;
        for(w_col = 1; w_col <= _maxColumns; w_col++){

            //Me fijo si se eliminaron dulces de esta columna 
            w_colDOM = $('.col-' + w_col);
            w_arrayImg = w_colDOM.find('img');
            //Me fijo si la columna está "llena" de dulces
            w_difference = Math.abs(w_arrayImg.length - _maxRows);
            if(w_difference === 0)
                continue;
            
            while(w_difference > 0){                                
                w_candy = addCandyToColumn(w_col, w_difference);
                w_candy.hide();
                w_array.push(w_candy);
                w_difference--;
            }
        } 
        
        dropCandyArray(w_array);     
    }catch(ex){
        clearInterval(_refillTimerId);
        alert(ex.message);
    }
}

//Descr: Obtiene la columna, es decir, el elemento del DOM.
//p_column => Índice de la columna.
function getColumn(p_column){
    var w_col = 'div.col-' + String(p_column);
    return $(w_col);
}

//Descr: Refresca la información de los objetos de la grilla
function refreshGridData(){
    for(var w_col = 1; w_col <= _maxColumns; w_col++)
        refreshColumnData(w_col);
}

//Descr: Refresca los datos de los elementos de una columna
function refreshColumnData(p_column, p_ColumnElement){
    //Actualizo los datos de los dulces
    var w_id = '';
    var w_row = _maxRows;
    var w_columnElement = getColumn(p_column);
    var w_arrayImg = w_columnElement.find('img');
    $.each(w_arrayImg, function(index, element){
        w_id = generateCandyId(p_column, w_row);
        $(element).attr({
            'id': w_id,
            'data-row': w_row,
            'data-col': p_column
        });                    
        
        addDragAnimation($(element));
        w_row--;
    });
}

//========Fin Grilla======

//============Combinaciones de dulces==========
//Descr: Busca y elimina combinaciones. Además devuleve un bool
//que dice si hubo al menos una combinación
function scanCombinations(){
    var w_col = 0, w_row = 0, w_value = 0, w_horizontalSize = 0, w_verticalSize = 0, w_combinationSize = 0;
    var w_left = {}, w_right = {}, w_up = {}, w_down = {};
    var w_candy = null;
    var w_array = [];

    try{
        if($('img[id^=candy-]').length  != _maxColumns * _maxRows)
            return;

        for(w_col = 1; w_col <= _maxColumns; w_col++){
            for(w_row = 1; w_row <= _maxRows; w_row++){
                w_value = getCandyName(w_col, w_row);

                //Busco a la izquierda
                w_left = scanLeft(w_col, w_row, w_value);
                //Busco a la derecha
                w_right = scanRight(w_col, w_row, w_value);
                w_horizontalSize = w_left.count + w_right.count + 1;

                //Busco hacia arriba
                w_up = scanUp(w_row, w_col, w_value);
                //Busco hacia abajo
                w_down = scanDown(w_row, w_col, w_value);
                w_verticalSize = w_up.count + w_down.count + 1;
                
                if(Math.max(w_verticalSize, w_horizontalSize) >= _minCombinationSize){                   
                    //Dulce actual
                    w_candy = getCandy(w_col, w_row);
                    w_array.push(w_candy);

                    if(w_verticalSize >= _minCombinationSize){
                        w_combinationSize = w_verticalSize;
                        $.merge(w_array, w_up.array);
                        $.merge(w_array, w_down.array);                        
                    }
                    if(w_horizontalSize >= _minCombinationSize){
                        w_combinationSize += w_horizontalSize;
                        $.merge(w_array, w_left.array);
                        $.merge(w_array, w_right.array);
                    }
                    
                    calculatePoints(w_combinationSize);
                }                
            }
        }

        if(w_array.length > 0)
            startRemoveCandyAnimation(w_array);
                
    }catch(ex){
        clearInterval(_combinationTimerId);
        alert(ex.message);        
    } 
}

//Descr: Escanea elementos iguales hacia a la izquierda del punto actual
function scanLeft(p_startColumn, p_row, p_element){
    var w_col = 0, w_value = 0, w_count = 0;
    var w_array = []; 
    var w_candy = null;   
    
    if(p_startColumn <= 1)
        return { count: 0, array: [] };
    
    for(w_col = p_startColumn - 1; w_col > 0; w_col--){        
        w_value = getCandyName(w_col, p_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(w_col, p_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//Descr: Escanea elementos iguales hacia a la derecha del punto actual
function scanRight(p_startColumn, p_row, p_element){
    var w_col = 0, w_value = 0, w_count = 0;    
    var w_array = [];
    var w_candy = null;   

    if(p_startColumn >= _maxColumns)
        return { count: 0, array: [] };
    
    for(w_col = p_startColumn + 1; w_col <= _maxColumns; w_col++){        
        w_value = getCandyName(w_col, p_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(w_col, p_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//Descr: Escanea elementos arriba hacia abajo del punto actual
function scanUp(p_startRow, p_column, p_element){
    var w_row = 0, w_value = 0, w_count = 0;
    var w_array = [];
    var w_candy = null;   

    if(p_startRow <= 1)
        return { count: 0, array: [] };
    
    for(w_row = p_startRow - 1; w_row > 0; w_row--){
        w_value = getCandyName(p_column, w_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(p_column, w_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//Descr: Escanea elementos iguales hacia abajo del punto actual
function scanDown(p_startRow, p_column, p_element){
    var w_row = 0, w_value = 0, w_count = 0;
    var w_array = [];
    var w_candy = null;   

    if(p_startRow >= _maxRows)
        return { count: 0, array: [] };
    
    for(w_row = p_startRow + 1; w_row <= _maxRows; w_row++){
        w_value = getCandyName(p_column, w_row);
        if(w_value !== p_element)
            return { count: w_count, array: w_array };
        w_candy = getCandy(p_column, w_row);
        w_array.push(w_candy);
        w_count++;
    }

    return { count: w_count, array: w_array };
}

//============Combinaciones de dulces==========

//============Animaciones de desaparición de dulce==========
//Descr: Inicia la animación que muestra la aliminación de un dulce.
function startRemoveCandyAnimation(p_array){    
    var w_candy = null;
    var w_id = '';

    if(_lock || p_array.length == 0)
        return;        

    _lock = true;
    _onFadeToggleAnimation = {};
    while(p_array.length > 0){
        w_candy = p_array.pop();
        w_id = getCandyId(w_candy);
        _onFadeToggleAnimation[w_id] = w_candy;
       
        removeCandyAnimationToggle(w_candy, 0, 2);
    }    
}

//Descr: Cambia la visibilidad de un dulce
function removeCandyAnimationToggle(p_candyObj, p_count, p_max){
    var w_id = '';

    if(p_candyObj.is(':animated'))
        return;
    p_candyObj.fadeToggle(300, 'linear', function(){
        if(p_count == p_max){           
            w_id = getCandyId(p_candyObj); 
            p_candyObj.remove();   
            delete _onFadeToggleAnimation[w_id];

            if(Object.keys(_onFadeToggleAnimation).length == 0)
                _lock = false;  
            
            return;
        }
        p_count++;
        removeCandyAnimationToggle(p_candyObj, p_count, p_max);
    });
}
//==========Fin Animaciones de desaparición de dulce========

//==========Eventos========
//Descr: Inicia o reinicia el juego
function startGame(){    
    try{       
        _lock = false; 
        if($('.btn-reinicio').html() === 'Reiniciar'){                        
            if(!$('.panel-tablero').is(':visible'))
                restoreView();
            else
                stopGame();
        }else{
            _width1 = $('.panel-tablero').width();
            _width2 = $('.panel-score').width();
        }

        $('#timer').html('02:00');

        $('.btn-reinicio').html('Reiniciar');
        $('#score-text').html(0);
        $('#movimientos-text').html(0);
        initGrid();
        startTimer();
    }catch(ex){
        alert(ex.message);
    }
}

//Descr: detiene la partida
function stopGame(){
    try {
        _lock = true;
        clearInterval(_clockId);
        clearInterval(_combinationTimerId);
        clearInterval(_refillTimerId);
        
        $('.btn-reinicio').html('Reiniciar');        
        $('#timer').html('02:00');

        clearGrid();

        showScore();
    }catch(ex){
        alert(ex.message);
    }
}

$(document).ready(function(){
    try{
        titleAnimationWhite();   
        $('button.btn-reinicio').on('click', function() { startGame(); }); 
    }catch(ex){
        alert(ex.message);
    }
});
//========Fin Eventos======

//========Drag animation======
var _left = 0, _top = 0;
function addDragAnimation(p_candy){
    p_candy.draggable({
        distance: 10,
        drag: function(event,ui){
            var w_swapCandy = null;
            var w_data = getCandyData(p_candy), w_dataTarget = {};
            var w_top = Math.abs(ui.position.top);
            var w_left = Math.abs(ui.position.left);            
            var w_metadata = {}, w_direction = {};
            var w_canMoveSource = false, w_canMoveTarget = false;

            if(Math.max(w_top, w_left) == w_left){
                w_direction.orientation = 'horizontal';
                if(ui.position.left > 0){
                    w_direction.direction = 'right';
                    w_canMoveSource = canMove(w_data.column + 1, w_data.row, w_data.element, w_direction.direction);
                    w_swapCandy = getCandy(w_data.column + 1, w_data.row);
                    w_metadata.dest = { id: w_swapCandy, column: w_data.column + 1, row: w_data.row};
                } else {
                    w_direction.direction = 'left';
                    w_canMoveSource = canMove(w_data.column - 1, w_data.row, w_data.element, w_direction.direction);
                    w_swapCandy = getCandy(w_data.column - 1, w_data.row);
                     w_metadata.dest = { id: w_swapCandy, column: w_data.column - 1, row: w_data.row};
                }
            } else {
                w_direction.orientation = 'vertical';
                if(ui.position.top < 0){
                    w_direction.direction = 'up';
                    w_canMoveSource = canMove(w_data.column, w_data.row + 1, w_data.element, w_direction.direction);
                    w_swapCandy = getCandy(w_data.column, w_data.row + 1);
                    w_metadata = { id: w_swapCandy, column: w_data.column, row: w_data.row + 1 };
                } else {
                    w_direction.direction = 'down';
                    w_canMoveSource = canMove(w_data.column, w_data.row - 1, w_data.element, w_direction.direction);
                    w_swapCandy = getCandy(w_data.column, w_data.row - 1);
                    w_metadata = { id: w_swapCandy, column: w_data.column, row: w_data.row - 1};
                }
            }

            _lock = true;
            //Verifica si es posible el intercambio de dulces         
            if(w_canMoveSource || w_canMoveTarget){
                countMovement();
                swap($(ui.helper), w_swapCandy, w_direction, function(){ _lock = false; });
            }else 
                cancelSwap($(ui.helper), 10, w_direction, function(){ _lock = false; })

            event.preventDefault();
        }
    });
    
}
//======Fin Drag animation====


//========Temporizador======
function startTimer(){
    _clockId = setInterval(function(){ tick(); }, 1000);
}

//Descr: Se ejecuta cada 1 seg y decrementa el contador
function tick(){
    var w_time = $('#timer').html().split(':');
    var w_min = Number(w_time[0]);
    var w_sec = Number(w_time[1]);

    if(w_sec > 0){
        w_sec--;        
        //$('#timer').html('0' + w_min + ':' + w_sec);  
    } else
        w_sec = (w_min > 0) ? 59 : 0;

    if(w_min === 0 && w_sec === 0){        
        stopGame();
        return; 
    }
    if(w_sec === 59)
        w_min--;
    w_sec = (w_sec < 10) ? '0' + w_sec : w_sec;
    $('#timer').html('0' + w_min + ':' + w_sec);
}
//======Fin Temporizador====

//========Mostrar resultados======


//Descr: Incrementa en uno el contador de movimientos
function countMovement(){
    var w_counterPanel = $('#movimientos-text');
    var w_total = Number(w_counterPanel.html()) + 1;
    w_counterPanel.html(w_total);
}

//Descr: Muestra la pantalla de resultados
function showScore(){
    $('.panel-tablero').animate({
        width: '-=' + $('.panel-tablero').width()
    }, 500, function(){
        $('.panel-tablero').hide();        
    });    
    
    $('.panel-score').animate({
        width: '+=' + ($(document).width() * 0.8),
    }, 700, function(){
        $('.time').hide();
    });
}

//Descr: Reincia la vista para poder jugar otra partida
function restoreView(){
    $('.panel-tablero').show();
    $('.panel-tablero').animate({
        width: '+=' + _width1
    }, 700, function(){
    });    
    
    $('.panel-score').animate({
        width: '-=' + ($(document).width() * 0.8),
    }, 500, function(){
        $('.panel-score').width(_width2);
        $('.time').show();
        $('#score-text').html(0);
        $('#movimientos-text').html(0);
    });
}
//======Fin Mostrar resultados====


