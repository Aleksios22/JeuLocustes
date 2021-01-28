/**
 * Class representant la scène du jeu qui charge les médias.
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene 
{

	constructor() 
	{
		super("SceneChargement");
	}

	preload() 
	{

		let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
		this.load.plugin('rexvirtualjoystickplugin', url, true);

		//Partie du chemin commun aux images...
		this.load.setPath("medias/img/");

		//Charger les images du jeu
		this.load.image("fond");
		this.load.image("fondIntro");
		this.load.image("EcranAide");
		this.load.image("batiment");

		// Chargement de 3 des ennemis avec une boucle
		for (let i = 1; i < 4; i++) 
		{
			this.load.image(`locuste${i}`);
		}


		//Personnage
		this.load.spritesheet("personnage", "personnage.png", 
		{
			frameWidth: 460,
			frameHeight: 600,
		});


		//Charger les sons
		this.load.setPath("medias/sons/");
		this.load.audio("musiqueFond", ["Musique-boucle.mp3", "Musique-boucle.ogg"]);
		// Source: de TheMIDIMan1 sur https://twitter.com/beepboxco
		
	}

	create() 
	{

		this.scene.start("SceneIntro");
	}
}