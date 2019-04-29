class DuckPrompt extends eui.Component implements eui.UIComponent {
    public constructor(info:string) {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/skins/DuckPromptSkins.exml";
        this.duck_language.text = info;
    }

    private duck_language: eui.Label;

    private onComplete() {
        this.anchorOffsetX = 169;
        this.anchorOffsetY = 91;
        this.x = 169;
        this.y = 91;
    }
}