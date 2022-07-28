import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import DismissKeyboardView from '@src/components/atoms/DismissKeyboardView';
import axios, {AxiosError} from 'axios';
import {RootStackParamList} from '@src/AppInner';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;
const SignUp = ({navigation}: SignUpScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const emailRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const canGoNext = name && email && password && checked;

  const onChangeName = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setName(event.nativeEvent.text.trim());
    },
    [],
  );

  const onChangeEmail = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setEmail(event.nativeEvent.text.trim());
    },
    [],
  );

  const onChangePassword = useCallback(
    (event: NativeSyntheticEvent<TextInputChangeEventData>) => {
      setPassword(event.nativeEvent.text.trim());
    },
    [],
  );

  const onChangeChecked = useCallback(() => {
    setChecked(!checked);
  }, [checked]);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }

    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }

    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }

    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }

    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }

    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }

    if (!checked) {
      return Alert.alert('알림', '약관에 동의해주세요');
    }

    try {
      setLoading(true);
      const API_URL = 'http://127.0.0.1:3105';
      const response = await axios.post(`${API_URL}/user`, {
        email,
        name,
        password,
      });
      Alert.alert('알림', '회원가입 되었습니다.');
      navigation.navigate('SignIn');
      console.log(response);
    } catch (error) {
      console.log('error', error);
      console.log(email, name, password);
      const errorResponse = (error as AxiosError<{message: string}>).response;
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data?.message);
      }
    } finally {
      setLoading(false);
    }
  }, [name, email, password, checked, loading, navigation]);
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          placeholder="이름을 입력해주세요."
          placeholderTextColor="#666"
          onChange={event => onChangeName(event)}
          onSubmitEditing={() => nameRef.current?.focus()}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nameRef}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          value={email}
          placeholder="이메일을 입력해주세요."
          placeholderTextColor="#666"
          onChange={event => onChangeEmail(event)}
          onSubmitEditing={() => emailRef.current?.focus()}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          keyboardType="email-address"
          returnKeyType="next"
          blurOnSubmit={false}
          ref={emailRef}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
          onChange={event => onChangePassword(event)}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          placeholderTextColor="#666"
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          returnKeyType="send"
          ref={passwordRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
          clearButtonMode="while-editing"
          secureTextEntry
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>약관</Text>
        <View style={styles.checkWrapper}>
          <CheckBox
            style={styles.checkBox}
            value={checked}
            onChange={onChangeChecked}
          />
          <Text style={styles.checkboxText}>약관에 동의하시겠습니까?</Text>
        </View>
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.button, styles.buttonActive)
              : styles.button
          }
          disabled={!canGoNext || loading}
          onPress={onSubmit}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
  },
  label: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonZone: {
    alignItems: 'center',
  },
  button: {
    width: 90,
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: 'lightblue',
  },
  buttonText: {
    color: '#fff',
  },
  checkBox: {
    width: 20,
    height: 18,
    marginRight: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  checkWrapper: {
    flexDirection: 'row',
  },
  checkboxText: {
    color: '#666',
    fontWeight: 'bold',
  },
});

export default SignUp;
