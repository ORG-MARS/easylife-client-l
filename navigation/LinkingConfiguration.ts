import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      User: {
        screens: {
          Dashboard: {
            screens: {
              DashboardScreen: 'dashboard',
              DealDetail: 'deal-detail'
            },
          },
          Messages: {
            screens: {
              MessagesScreen: 'messages',
              NewContactScreen: 'new-contact',
              RoomScreen: 'room'
            },
          },
          AddNew:{
            screens: {
            },
          },
          Social:{
            screens: {
              SocialScreen: 'social',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile',
            },
          }
        },
      },
      New:{
        screens: {

        },
      },
      
      Signin:{
        screens: {
          SigninScreen: 'singin',
        },
      },
      NotFound: '*',
    },
  },
};
