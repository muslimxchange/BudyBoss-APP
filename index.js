import HelloWorldScreen from './HelloWorldScreen';
import HomeButton from './HomeButton';

export const applyCustomCode = externalCodeSetup => {
  externalCodeSetup.navigationApi.addNavigationRoute({
    name: 'HelloWorld',
    component: HelloWorldScreen,
    options: {
      title: 'Hello World',
    },
  });

  externalCodeSetup.hooks.addFilter(
    'app.HomeScreen.render',
    'custom.home.button',
    (DefaultComponent) => (props) => (
      <>
        <HomeButton />
        <DefaultComponent {...props} />
      </>
    )
  );
};
