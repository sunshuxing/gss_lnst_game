class DuckPrompt extends eui.Component implements eui.UIComponent {
    public constructor(info:string) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/DuckPromptSkins.exml";
        this.duck_language.text = info;
    }

    private duck_language: eui.Label;

    private onComplete() {
        this.anchorOffsetX = 150;
        this.anchorOffsetY = 97;
        this.x = 150;
        this.y = 97;
    }
}