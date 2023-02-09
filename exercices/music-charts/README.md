# Exercice Music Charts

L'objectif de cet exercice est de réimplémenter l'application de [l'exercice JS Music Charts](https://github.com/drazik/cours-js/tree/master/exercices/music-charts) avec React.

## Récupération des sources

```console
npx degit drazik/cours-react/exercices/music-charts music-charts-react
cd music-charts
npm install
code .
```

## Brief

L'objectif est d'implémenter une application qui présente à l'utilisateur une liste de top artistes, un formulaire de recherche, et les détails d'un artiste. Les données sont récupérées à partir de l'API Last.fm (cf [exercice original](https://github.com/drazik/cours-js/tree/master/exercices/music-charts#cr%C3%A9ation-dune-cl%C3%A9-api-sur-lastfm) pour récupérer une clé d'API).

Lorsque l'utilisateur click sur un top artiste, les données de cet artiste doivent s'afficher. Lorsqu'il fait une recherche, des suggestions doivent s'afficher, et lorsqu'il sélectionne une suggestion, les données de l'artiste sélectionné doivent s'afficher.

## Composant `Artist`

Ce composant affiche les détails d'un artiste.

Il s'utilise de la manière suivante :

```jsx
import { Artist } from "./Artist"

const App = () => {
  return <Artist name={"daft punk"} />
}
```

Il prend donc une seule prop: `name`, qui prend comme valeur le nom de l'artiste à afficher.

Lorsque le composant est affiché et à chaque fois que la prop `name` change, un appel à la fonction `fetchArtist` du module `api` doit être lancé. Attention à prendre soin d'annuler les requêtes déjà en cours à l'aide un [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).

Avec les données retournées par l'API, afficher les infos de l'artiste dans la page. Pour la structure du DOM, vous pouvez reprendre [celle de l'exercice original](https://github.com/drazik/cours-js/blob/master/exercices/music-charts/components/Artist-finished.js#L41-L78).

Pensez à gérer les états de chargement et d'erreur.

## Composant `ArtistsChart`

Ce composant affiche les top artistes renvoyés par l'API Last.fm.

Il s'utilise de la manière suivante :

```jsx
import { ArtistsChart } from "./ArtistsChart"

const App = () => {
  const handleSelectArtist = (artist) => {
    console.log(artist)
  }

  return <ArtistsChart onSelectArtist={handleSelectArtist} />
}
```

Il prend donc une seule prop: `onSelectArtist` qui prend comme valeur une fonction qui reçoit en paramètre l'artiste sélectionné.

Lorsque le composant est affiché, un appel à la fonction `fetchTopArtistsChart` du module `api` doit être lancé.

Avec les données retournées par l'API, afficher la liste des top artistes. Pour la structure du DOM, vous pouvez reprendre [celle de l'exercice original](https://github.com/drazik/cours-js/blob/master/exercices/music-charts/components/ArtistsChart-finished.js#L67-L74). L'objectif est d'afficher un bouton pour chaque artiste.

Pensez à gérer le nettoyage des effets. Ainsi qu'à gérer les états de chargement et d'erreur.

Lorsque l'utilisateur click sur un des boutons, la fonction `onSelectArtist` reçue dans les props du composant est appelée avec l'artiste sélectionné en paramètre.

Enfin, dans le composant `App`, interfacez ce composant avec le composant `Artist`, de manière à afficher les détails de l'artiste sur lequel l'utilisateur a cliqué.

Pour cela, définissez un state qui contiendra le nom de l'artiste sélectionné.

## Composant `SearchForm`

Ce composant affiche un champ de formulaire avec suggestions permettant à l'utilisateur de taper le nom d'un artiste et de se voir proposer des suggestions pour compléter sa saisie.

Il s'utilise de la manière suivante:

```jsx
import { SearchForm } from "./SearchForm"

const App = () => {
  const handleSelectArtist = (artist) => {
    console.log(artist.name)
  }

  return <SearchForm onSelectArtist={handleSelectArtist} />
}
```

Il prend donc une seule prop: `onSelectArtist` qui prend comme valeur une fonction qui reçoit en paramètre l'artiste sélectionné.

Pour la structure du DOM, reprenez [celle de l'exercice original](https://github.com/drazik/cours-js/blob/master/exercices/music-charts/index.html#L17-L21).

Lorsque l'utilisateur fait une saisie dans l'input:

- Si la saisie (une fois les espaces supprimés) est vide, alors on ne fait pas de requête : on considère que l'API nous a renvoyé un tableau vide
- Sinon, on fait un appel à la fonction `fetchArtists` du module `api`

Avec les données renvoyées par l'API, on constitue la liste de suggestions. Pour cela, vous pouvez vous inspirer [du DOM de l'exercice original](https://github.com/drazik/cours-js/blob/master/exercices/music-charts/components/SearchForm-finished.js#L97-L102).

Pensez à gérer l'annulation des requêtes précédentes.

Lorsque l'utilisateur sélectionne une suggestion, la fonction `onSelectArtist` reçue dans les props du composant doit être appelée avec l'artiste sélectionné en paramètre. Inspirez-vous du fonctionnement du [composant `SearchForm` de l'exercice original](https://github.com/drazik/cours-js/blob/master/exercices/music-charts/components/SearchForm-finished.js#L28-L32).

Enfin, intégrez ce composant dans le composant `App` pour qu'il modifie le state contenant l'artiste sélectionné lorsque l'utilisateur sélectionne un artiste.

## Conclusion

Avec cet exercice, nous avons vu les notions suivantes :

- Etat local d'un composant (avec `useState`)
- Effets (avec `useEffect`)
- Gestion des requêtes réseaux dans un composant, avec annulation
- Affichage conditionnel

## Idées d'amélioration

### Extraction d'un hook `useQuery`

Le code est actuellement assez répétitif. Chaque composant qui a besoin de données issues de l'API gère un state dans lequel on a un objet `{ status, data, error }`. Cette gestion du state pourrait être extraite dans un hook `useQuery` qui prend en paramètre un objet avec les propriétés suivantes :

- `queryFn`: la fonction à exécuter pour récupérer les données auprès du serveur
- `queryKey`: les dépendances de l'effet
- `enabled`: true si la requête doit être exécutée, false sinon

Et renvoie un objet avec les propriétés suivantes:

- `status`
- `data`
- `error`

Ainsi, le composant `Artist` pourrait remplacer toute sa gestion des requêtes réseau par :

```jsx
import { useQuery } from "./query"
import { fetchArtist } from "./api"

const Artist = (props) => {
	const query = useQuery({
		queryFn: () => fetchArtist(props.name),
		queryKey: [props.name],
		enabled: props.name !== ""
	})

	return (
		// ...
	)
}
```

### Ajouter un peu de style

Il n'y a aucun CSS pour cette application. Vous pouvez en ajouter un peu pour la rendre plus agréable à utiliser.
