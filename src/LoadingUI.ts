//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends eui.Component {

    public constructor(text?:string) {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.createView,this)
        if(text){
            this.text = text
        }
    }

    private textField: egret.TextField;
    private logo:eui.Image;
    private loadingbg:eui.Image;
    private text:string

    private createView(): void {
        this.textField = new egret.TextField();
        this.logo = new eui.Image();
        this.loadingbg = new eui.Image();
        this.loadingbg.texture = RES.getRes("loading-bg_png");
        this.loadingbg.height = 1344;
        this.loadingbg.y = this.stage.stageHeight - this.loadingbg.height;
        this.addChild(this.loadingbg);
        this.logo.texture = RES.getRes("logo_png");
        this.logo.width = 294;
        this.logo.height = 292;
        this.logo.x = 375;
        this.logo.y = 505 + (this.stage.stageHeight - this.loadingbg.height);
        this.logo.anchorOffsetX = this.logo.width/2;
        this.logo.anchorOffsetY = this.logo.height/2;
        this.addChild(this.logo);
        this.addChild(this.textField);
        this.textField.y = 820 + (this.stage.stageHeight - this.loadingbg.height);
        this.textField.width = 250;
        this.textField.x = 250;
        this.textField.size = 36;
        this.textField.bold = true;
        this.textField.textAlign = "center";
        this.textField.textColor = 0xFFFFFF;
        egret.Tween.get(this.logo,{loop:true})
        .to({rotation:360},5000)
        this.textField.text = this.text;
    }

    public onProgress(current: number, total: number): void {
        this.textField.text = Math.floor((current / total) * 100) + "%";
    }
}
