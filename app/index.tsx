import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import {View,Text,StyleSheet,Image,TouchableOpacity,TextInput,Dimensions,ScrollView,KeyboardAvoidingView,Platform,Animated,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5, Ionicons, AntDesign } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Index() {

  const router=useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);


  const skipToLogin = () => {
    setIsLogin(true);
  };

  const handleLogin = () => {
    if (!email ||!password) {
      alert('Please fill out all fields');
      return;
    }
   // const data=login(email, password)

      try {
       // await AsyncStorage.setItem('user', JSON.stringify({ email, password }));
       // await AsyncStorage.setItem('isLogin', JSON.stringify(true));
        router.replace('../home/');
      } catch (error) {
        console.error('Error saving data', error);
      }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  if (!isLogin) {
    return (
      <Text>you not login</Text>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4158D0', '#C850C0']}
        style={styles.loginGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.loginHeader}>
          <View style={styles.logoContainer}>
            <FontAwesome5 name="business-time" size={40} color="white" />
          </View>
          <Text style={styles.loginTitle}>Business Pro</Text>
          <Text style={styles.loginSubtitle}>
            {isLogin ? "Welcome back! Let's sign you in" : "Create an account to get started"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.loginForm}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.passwordToggle}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {isLogin && (
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <LinearGradient
            colors={['#4158D0', '#C850C0']}
            style={styles.loginButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.loginButtonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#363339', '#000000']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.buttonContent}>
                <AntDesign name="google" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.loginText}>
                  {isLogin ? 'Sign In With Google' : 'Create Account'}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

        </View>

        <TouchableOpacity style={styles.switchModeContainer} onPress={toggleAuthMode}>
          <Text style={styles.switchModeText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={styles.switchModeHighlight}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    position: 'absolute',
    width: '100%',
    top: 50,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: height * 0.5,
    width: width,
    backgroundColor: '#f5f5f5',
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
    zIndex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    padding: 15,
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 40,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextButton: {
    marginBottom: 40,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,

  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  // Login styles
  loginGradient: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: height * 0.35,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loginHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginHorizontal: 40,
  },
  loginForm: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4158D0',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,

  },
  loginButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#888',
    fontSize: 14,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',

  },
  switchModeContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  switchModeText: {
    fontSize: 14,
    color: '#666',
  },
  switchModeHighlight: {
    color: '#4158D0',
    fontWeight: 'bold',
  },
});
