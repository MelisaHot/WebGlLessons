class Shader{
    constructor(gl, vertShaderSrc, fragShaderSrc){
        this.program = ShaderUtil.createProgramFromText(gl, vertShaderSrc, fragShaderSrc, true);
        if(this.program!= null){
            this.gl=gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getStandardAttribLocations(gl, this.program);
            this.uniformLoc= {}; // we will need it in later lessons
        }
    }

    // methods 
    activate(){this.gl.useProgram(this.program); return this;}
    deactivate(){ this.gl.useProgram(null); return this;}

    //function help clean up resources when shader s no longer needed
    dispose(){
        if(this.gl.getParameter(thi.gl.CURRENT_PROGRAM) === this.program) this.gl.useProgram(null);
        this.gl.deleteProgram(this.program);
    }

    preRender(){} // do things we need before render

    renderModal(modal){
        this.gl.bindVertexArray(modal.mesh.vao);

        if(modal.mesh.indexCount) this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexLength, gl.UNSIGNED_SHORT, 0);
        else this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vertexCount);

        this.gl.bindVertexArray(null);

        return this;
    }
}




class ShaderUtil{
    static domShaderSrc(elmID){
        var elm = document.getElementById(elmID);
        if(!elm || elm.text == ""){console.log(elmID + "shader not found or no text."); return null;}
        return elm.text;
    }

    static createShader(gl, src, type){
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl. compileShader(shader);

        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.error("Error compiling shader: " +src, gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    static createProgram(gl, vShader, fShader, doValidate){
        // link shader together
        var prog = gl.createProgram();
        gl.attachShader(prog, vShader);
        gl.attachShader(prog, fShader);

        gl.bindAttribLocation(prog, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
        gl.bindAttribLocation(prog, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
        gl.bindAttribLocation(prog, ATTR_UV_LOC, ATTR_UV_NAME);
        
        gl.linkProgram(prog);

        //check if successfull
        if(!gl.getProgramParameter(prog, gl.LINK_STATUS)){
            console.log("error creating shader program.", gl.getParamInfoLog(prog));
            gl.deleteProgram(prog);
            return null;
        }

        if(doValidate){
            gl.validateProgram(prog);
            if(!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)){
                console.log("error validating program", gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }
        }

        return prog;
    }

    static getStandardAttribLocations(gl, program){
        return{
            position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
            norm:     gl.getAttribLocation(program, ATTR_NORMAL_NAME),
            uv:       gl.getAttribLocation(program, ATTR_UV_NAME)
        };
    }

    static domShaderProgram(gl, vectID, fragID, doValidate){
        //1. get vertex and fragment shader text
        var vShaderTxt = ShaderUtil.domShaderSrc(vectID);   if(!vShaderTxt) return null;
        var fShaderTxt = ShaderUtil.domShaderSrc(fragID);   if(!fShaderTxt) return null;

    //2. cmpile text and validate
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);    if(!vShader) return null;
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);  if(!fShader){gl.deleteShader(vShader); return null;} 

    //3. link the shaders together as a program
    return  ShaderUtil.createProgram(gl, vShader, fShader, true);
    }

    static createProgramFromText(gl, vShaderTxt, fShaderTxt, doValidate){
        var vShader = ShaderUtil.createShader(gl, vShaderTxt, gl.VERTEX_SHADER);        if(!vShader) return null;
        var fShader = ShaderUtil.createShader(gl, fShaderTxt, gl.FRAGMENT_SHADER);      if (!fShader){gl.deleteShader(vShader); return  null;}

        return ShaderUtil.createProgram(gl, vShader, fShader, true);
    }

}   