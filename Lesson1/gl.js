function GLInstance(canvasID){
    var canvas = document.getElementById(canvasID);
    gl = canvas.getContext("webgl2");

    if(!gl){console.log("Webgl context not available."); return null;}

    //Setup GL, set all default onfigurations we need.
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // clear color

    //Methods:
    gl.fClear = function(){ this.clear(this.COLOR_BUFFER_BIT | this.DEPTH_BUFFER_BIT); return this;}


    // setters getters 

    gl.fSetSize = function(w,h){
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h +"px";
        this.canvas.width= w;
        this.canvas.height= h;

        this.viewport(0, 0, w, h);
        return this;    
    }

    
    return gl;
}