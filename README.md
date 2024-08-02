# watermelon-db-expo-dev-plugin

A [@nozbe/watermelondb](https://github.com/nozbe/WatermelonDB) DevTool that can run in an Expo App

# Installation

### Add the package to your project

```
npx expo install watermelon-db-expo-dev-plugin
```

### Integrate async-storage with the DevTool hook

```jsx
import { useWatermelonDevTools } from 'watermelon-db-expo-dev-plugin';

export default function App() {
  useWatermelonDevTools({ database });

  /* ... */
}
```
