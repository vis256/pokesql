export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text : 'Moje Pokemony',
    path : 'mypokemon',
    icon : 'activefolder'
  },
  {
    text : 'Kompendium Pokemon',
    icon : 'globe',
    items : [
      {
        text : 'Pokedex',
        path : '/pokedexlist',
        icon : 'folder'
      },
      {
        text : 'Pokeballe',
        path : '/pokeballs',
        icon : 'folder'
      },
    ]
  },

  {
    text: 'Laboratorium',
    icon: 'globe',
    path : '/laboratory'
  },

];
