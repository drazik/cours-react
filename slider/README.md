# Exercice Slider

L'objectif de cet exercice est de réimplémenter le slider de [l'exercice JS Slider](https://github.com/drazik/cours-js/tree/master/exercices/slider-avec-evenements) avec React.

## Récupération des sources

```console
npx degit drazik/cours-react/exercices/slider slider-react
cd slider-react
npm install
code .
```

## Brief

On souhaite implémenter un composant qui s'utilise de la façon suivante :

```jsx
import { Slider } from "./Slider"

const App = () => {
	return (
		<div>
			<Slider>
				<div>Slide 1</div>
				<div>Slide 2</div>
				<div>Slide 3</div>
			</Slider>
		</div>
	)
}
```

Le composant ne reçoit donc qu'une seule prop : `children`, c'est à dire les éléments enfants. Chaque élément enfant reçu correspond au contenu d'une slide.

Attention, `props.children` n'est pas forcément un tableau. Dans le cas où il n'y a qu'un seul élément enfant, alors `props.children` sera un objet correspondant à l'élément React (et non pas un tableau avec un seul élément).

Pour manipuler `props.children` sans se soucier de ces spécificités, React fournit le module [`React.Children`](https://beta.reactjs.org/reference/react/Children). Ce module permet par exemple de faire un `map` sur des children, ou encore de récupérer le nombre de children.

## Affichage des éléments

Reprendre la structure HTML suivante : https://github.com/drazik/cours-js/blob/master/exercices/slider-avec-evenements/index.html#L12-L34 et faire en sorte que le composant `Slider` affiche cette structure.

Remplacez les éléments des slides par les children reçus en props par le composant. De même, créez les bullets en itérant sur les children afin d'afficher une bullet pour chaque slide.

Attention, lorsqu'on utilise React, les attributs HTML et SVG doivent être remplacés par les propriétés JS d'un élément. Par exemple, `<label for="name" class="form-label">Nom</label>` s'écrit `<label htmlFor={"name"} className={"form-label"}>Nom</label>`. React fait de son mieux pour détecter les erreurs à ce niveau et nous afficher des messages d'avertissement dans la console du navigateur. N'hésitez donc pas à y jetter un oeil.

Le CSS est dans le fichier `Slider.css`, et celui-ci est importé dans le fichier `Slider.jsx`. Le fait de pouvoir importer un fichier CSS via un `import` JavaScript n'est pas lié à React. C'est une fonctionnalité de [Vite](https://vitejs.dev/guide/features.html#css). Tous les bundlers (Webpack, Rollup, Parcel...) proposent la même fonctionnalité.

## Click sur les boutons "précédent" et "suivant"

Pour changer de slide, nous avons besoin de savoir quel est l'index de la slide à afficher. Cet index sera incrémenté lorsqu'on click sur le bouton "suivant" et décrémenté lorsqu'on click sur le bouton "précédent". Mais l'index ne doit jamais être négatif, ni dépasser l'index de la dernière slide.

Chaque changement de l'index doit donner lieu à un re-rendu du composant. Il faudra donc utiliser un [state](https://beta.reactjs.org/learn/state-a-components-memory).

Pour réagir au click, il faut passer à un élément la prop `onClick` avec la fonction à exécuter :

```jsx
const Component = () => {
	const handleClick = () => {
		console.log("You clicked")
	}

	return (
		<button type={"button"} onClick={handleClick}>Click me</button>
	)
}
```

## Click sur les bullets

Lorsqu'on click sur une bullet, on veut "sauter" à la slide correspondant à l'index de la bullet. Pour cela, ajoutez une prop `onClick` sur chaque bullet, associée à une fonction qui récupère l'index de la bullet et met à jour l'index dans le state.

## Affichage dynamique

Nous avons maintenant un state qui contient l'index de la slide à afficher, et celui-ci est mis à jour au click sur les différents boutons qui composent le slider. Il ne nous reste plus qu'à conditionner les différentes parties du slider qui dépendent de cet index pour que l'affichage se mette à jour dynamiquement.

Pour cela, commençons par identifier les éléments qui dépendent de l'index :

- Le bouton "précédent" doit être désactivé si l'index est égal à `0`, activé sinon
- Le bouton "suivant" doit être désactivé si l'index est égal à l'index maximal, activé sinon
- La bullet active doit être désactivée, les autres doivent être activées
- La propriété CSS `transform` de l'élément `slider__slides` a pour valeur `translateX(-index * 100%)`

Avec des informations, utlisez le state `index` pour appliquer ces différentes règles sur les éléments concernés.

Pour manipuler dynamiquement le style d'un élément, vous pouvez utiliser la prop `style`. Par exemple, pour que la couleur de fond d'un élément soit rouge, on peut écrire :

```jsx
<div style={{ backgroundColor: "red" }}>Hello world</div>
```

Vous noterez que les propriétés s'écrivent en `camelCase` ici (`backgroundColor` pour `background-color`).

## Conclusion

Nous avons maintenant un composant `Slider` qui encapsule toute la logique liée au fonctionnement et à l'affichage d'un slider. Le contenu des slides n'est pas en dur, mais est récupéré via les éléments enfant du composant (`props.children`).

## Idées d'amélioration

### Ne rien afficher si il n'y a pas d'éléments enfant

Un slider sans slides n'a aucune raison d'être. On pourrait donc ne rien afficher du tout lorsque `props.children` ne contient rien.

### Extraire la logique d'évolution dans un hook

Ecrire un hook `useSlider` qui prend en paramètres le nombre de slides, et renvoie un objet avec les propriétés suivantes :

- `index`: l'index courant
- `previous`: une fonction qui passe à la slide précédente
- `next`: une fonction qui passe à la slide suivante
- `goTo`: une fonction qui prend en paramètre un index compris entre 0 et l'index maximum et "saute" sur la slide concernée

L'objectif est d'alléger l'implémentation du composant `Slider`, qui doit devenir:

```jsx
const Slider = (props) => {
  const { index, previous, next, goTo } = useSlider(React.Children.count(props.children))

	return (
		// ...
	)
}
```

Le deuxième objectif est de permettre facilement l'implémentation d'un slider qui aurait un affichage différent. Puisque la logique est extraite, elle peut être réutilisée dans une autre implémentation de slider:

```jsx
const AnotherSlider = (props) => {
  const { index, previous, next, goTo } = useSlider(React.Children.count(props.children))

	return (
		// Un affichage totalement différent de celui du composant `Slider`
	)
}
```
