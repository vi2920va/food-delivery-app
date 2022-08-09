import * as React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from './store/reducer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Orders from '@src/pages/Orders';
import Delivery from '@src/pages/Delivery';
import SignIn from '@src/pages/SignIn';
import SignUp from '@src/pages/SignUp';
import Mypage from '@src/pages/Mypage';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppInner = () => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{title: '주문목록'}}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{title: '배달', headerShown: false}}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
};

export default AppInner;
