//Importation des fichiers classes ou fichiers nécessaires
import 
{
	GrilleMontage
} from "../utils/GrilleMontage.js";


/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */

export class SceneFinale extends Phaser.Scene 
{

    constructor() 
    {
		super("SceneFinale");
	}

    init() 
    {

	}

    create() 
    {
       
		//Clic dans l'écran
        this.input.once("pointerdown", this.allerEcranJeu, this);

        //Consigne
		let tailleTexte = Math.round(40 * GrilleMontage.ajusterRatioX());
        let consigneTxt = this.add.text(game.config.width / 2, game.config.height / 2.5, "JEU TERMINÉ", 
        { 
			fontFamily: '"Heroes Legend", "Times New Roman"', fontSize: tailleTexte, color: '#FF0000'
		});

        let scoreTxt = this.add.text(game.config.width / 2, game.config.height / 2.5, "Score: "+ game.jeuLocustes.score,
        { 
			fontFamily: '"Heroes Legend", "Times New Roman"', fontSize: tailleTexte, color: '#FF0000'
		});
		
        consigneTxt.setOrigin(0.5, 2);
        scoreTxt.setOrigin(0.5, 0.5);

	}

    update() 
    {

	}



    allerEcranJeu() 
    {
		//Aller à l'écran de jeu
		this.scene.start("SceneJeu");
	}
}