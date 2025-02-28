import React, { useState, useEffect, } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  Linking,
  StatusBar,
  useColorScheme as _useColorScheme,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import { logout } from '@/api/logout';

// Mock user data
const initialUserData = {
  name: '',
  email: '',
  phone: '8448805135',
  profileImage: 'https://api.a0.dev/assets/image?text=modern%20professional%20avatar%20person%20portrait&aspect=1:1&seed=123',
};

export default function SettingsScreen() {
  const router=useRouter();

  const deviceColorScheme = _useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceColorScheme === 'dark');
  const [userData, setUserData] = useState(initialUserData);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editData, setEditData] = useState({ ...initialUserData });
  const [activeEditField, setActiveEditField] = useState('');
  const [profileImageOptions, setProfileImageOptions] = useState(false);

  // Apply theme based on state
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  }, [isDarkMode]);

  // Theme colors
  const theme = {
    backgroundColor: isDarkMode ? '#121212' : '#F8F9FA',
    cardBackground: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    textColor: isDarkMode ? '#FFFFFF' : '#212121',
    secondaryText: isDarkMode ? '#B3B3B3' : '#757575',
    accentColor: '#4F6CFF',
    dividerColor: isDarkMode ? '#2C2C2C' : '#EEEEEE',
    switchTrackColor: { false: '#767577', true: '#81b0ff' },
    switchThumbColor: isDarkMode ? '#f4f3f4' : '#f4f3f4',
    switchIOSBgColor: '#3e3e3e',
    modalBackground: isDarkMode ? '#262626' : '#FFFFFF',
    inputBackground: isDarkMode ? '#2C2C2C' : '#F5F5F5',
  };

  const handleSaveProfile = () => {
    setUserData({ ...editData });
    setEditModalVisible(false);
  };

  const generateNewProfileImage = () => {
    // Generate a new random seed for the profile image
    const randomSeed = Math.floor(Math.random() * 1000);
    const newImageUrl = `https://api.a0.dev/assets/image?text=modern%20professional%20avatar%20person%20portrait&aspect=1:1&seed=${randomSeed}`;
    setEditData({ ...editData, profileImage: newImageUrl });
    setProfileImageOptions(false);
  };

  const openCamera = () => {
    // In a real app, this would open the camera
    // For this demo, we'll just generate a new avatar
    generateNewProfileImage();
  };

  const openGallery = () => {
    // In a real app, this would open the gallery
    // For this demo, we'll just generate a new avatar
    generateNewProfileImage();
  };

  const handleLogout = async () => {
    try {
      await logout(); // Wait for AsyncStorage to clear
      router.push('..'); // Navigate after logout completes
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };



  const renderSettingItem = (
    icon,
    title,
    subtitle = null,
    action = null,
    rightElement = null,
    type = 'ionicons'
  ) => {
    const renderIcon = () => {
      switch (type) {
        case 'material':
          return <MaterialIcons name={icon} size={24} color={theme.accentColor} />;
        case 'material-community':
          return <MaterialCommunityIcons name={icon} size={24} color={theme.accentColor} />;
        case 'fontawesome5':
          return <FontAwesome5 name={icon} size={22} color={theme.accentColor} />;
        default:
          return <Ionicons name={icon} size={24} color={theme.accentColor} />;
      }
    };

    return (
      <TouchableOpacity
        style={[styles.settingItem, { borderBottomColor: theme.dividerColor }]}
        onPress={action}
        activeOpacity={action ? 0.7 : 1}
      >
        <View style={styles.settingIconContainer}>{renderIcon()}</View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, { color: theme.textColor }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.secondaryText }]}>{subtitle}</Text>}
        </View>
        {rightElement || (
          action && <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => setEditModalVisible(true)}
          >
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
            <View style={styles.editOverlay}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.textColor }]}>{userData.name}</Text>
            <Text style={[styles.profileDetail, { color: theme.secondaryText }]}>
              <Ionicons name="mail-outline" size={14} /> {userData.email}
            </Text>
            <Text style={[styles.profileDetail, { color: theme.secondaryText }]}>
              <Ionicons name="call-outline" size={14} /> {userData.phone}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <LinearGradient
              colors={['#4F6CFF', '#6A5ACD']}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.editButtonGradient}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Appearance</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            {renderSettingItem(
              'color-palette',
              'Dark Mode',
              'Switch between light and dark themes',
              null,
              <Switch
                trackColor={{ false: theme.switchTrackColor.false, true: theme.switchTrackColor.true }}
                thumbColor={isDarkMode ? theme.accentColor : theme.switchThumbColor}
                ios_backgroundColor={theme.switchIOSBgColor}
                onValueChange={() => setIsDarkMode(!isDarkMode)}
                value={isDarkMode}
              />,
              'material-community'
            )}
            {renderSettingItem(
              'textSize',
              'Text Size',
              'Change the text size of the app',
              () => {}, // Would open text size settings
              null,
              'material-community'
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Account</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            {renderSettingItem(
              'notifications',
              'Notifications',
              'Manage your notification preferences',
              () => {},
              null,
              'material'
            )}
            {renderSettingItem(
              'lock-closed',
              'Privacy',
              'Control your privacy settings',
              () => {}
            )}
            {renderSettingItem(
              'language',
              'Language',
              'Select your preferred language',
              () => {},
              null,
              'material'
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Support</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            {renderSettingItem(
              'help-circle',
              'Help Center',
              'Get help with using the app',
              () => Linking.openURL('https://example.com/help')
            )}
            {renderSettingItem(
              'information-circle',
              'About',
              'Learn more about the app',
              () => {}
            )}
            {renderSettingItem(
              'star',
              'Rate Us',
              'Rate your experience with the app',
              () => Linking.openURL('https://example.com/rate')
            )}
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Other</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            {renderSettingItem(
              'sync',
              'Sync Data',
              'Last synced: Today at 2:30 PM',
              () => {},
              null,
              'material'
            )}
            {renderSettingItem(
              'trash',
              'Clear Cache',
              'Free up space by clearing cached data',
              () => {}
            )}
            {renderSettingItem(
              'exit-outline',
              'Sign Out',
              'Log out of your account',
              () => {handleLogout();}
            )}
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.secondaryText }]}>
            Version 1.0.0 (Build 2025022501)
          </Text>
          <Text style={[styles.copyrightText, { color: theme.secondaryText }]}>
            © 2025 Nitesh. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.modalBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Profile Image Edit */}
              <View style={styles.modalProfileImageContainer}>
                <Image source={{ uri: editData.profileImage }} style={styles.modalProfileImage} />
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={() => setProfileImageOptions(true)}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textColor }]}>Name</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.textColor,
                      borderColor: activeEditField === 'name' ? theme.accentColor : theme.dividerColor
                    }
                  ]}
                  value={editData.name}
                  onChangeText={(text) => setEditData({ ...editData, name: text })}
                  onFocus={() => setActiveEditField('name')}
                  onBlur={() => setActiveEditField('')}
                  placeholderTextColor={theme.secondaryText}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textColor }]}>Email</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.textColor,
                      borderColor: activeEditField === 'email' ? theme.accentColor : theme.dividerColor
                    }
                  ]}
                  value={editData.email}
                  onChangeText={(text) => setEditData({ ...editData, email: text })}
                  keyboardType="email-address"
                  onFocus={() => setActiveEditField('email')}
                  onBlur={() => setActiveEditField('')}
                  placeholderTextColor={theme.secondaryText}
                />
              </View>

              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: theme.textColor }]}>Phone Number</Text>
                <TextInput
                  style={[
                    styles.formInput,
                    {
                      backgroundColor: theme.inputBackground,
                      color: theme.textColor,
                      borderColor: activeEditField === 'phone' ? theme.accentColor : theme.dividerColor
                    }
                  ]}
                  value={editData.phone}
                  onChangeText={(text) => setEditData({ ...editData, phone: text })}
                  keyboardType="phone-pad"
                  onFocus={() => setActiveEditField('phone')}
                  onBlur={() => setActiveEditField('')}
                  placeholderTextColor={theme.secondaryText}
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <LinearGradient
                  colors={['#4F6CFF', '#6A5ACD']}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Profile Image Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileImageOptions}
        onRequestClose={() => setProfileImageOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProfileImageOptions(false)}
        >
          <View
            style={[styles.imageOptionsContainer, { backgroundColor: theme.modalBackground }]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.imageOption}
              onPress={openCamera}
            >
              <Ionicons name="camera" size={24} color={theme.accentColor} />
              <Text style={[styles.imageOptionText, { color: theme.textColor }]}>Take Photo</Text>
            </TouchableOpacity>

            <View style={[styles.optionDivider, { backgroundColor: theme.dividerColor }]} />

            <TouchableOpacity
              style={styles.imageOption}
              onPress={openGallery}
            >
              <Ionicons name="image" size={24} color={theme.accentColor} />
              <Text style={[styles.imageOptionText, { color: theme.textColor }]}>Choose from Gallery</Text>
            </TouchableOpacity>

            <View style={[styles.optionDivider, { backgroundColor: theme.dividerColor }]} />

            <TouchableOpacity
              style={styles.imageOption}
              onPress={generateNewProfileImage}
            >
              <Ionicons name="refresh" size={24} color={theme.accentColor} />
              <Text style={[styles.imageOptionText, { color: theme.textColor }]}>Generate New Avatar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() => setProfileImageOptions(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4F6CFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  profileDetail: {
    fontSize: 14,
    marginBottom: 3,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  editButtonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
  sectionCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 108, 255, 0.1)',
    borderRadius: 12,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingBottom: 30,
  },
  versionText: {
    fontSize: 14,
  },
  copyrightText: {
    fontSize: 12,
    marginTop: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  modalProfileImageContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    marginTop: 10,
  },
  changePhotoText: {
    color: '#4F6CFF',
    fontSize: 16,
    fontWeight: '500',
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  formInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  saveButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonGradient: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Image Options Modal
  imageOptionsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  imageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  imageOptionText: {
    fontSize: 16,
    marginLeft: 16,
  },
  optionDivider: {
    height: 1,
    width: '92%',
    alignSelf: 'center',
  },
  cancelOption: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'rgba(79, 108, 255, 0.1)',
    marginHorizontal: 24,
    borderRadius: 12,
  },
  cancelText: {
    color: '#4F6CFF',
    fontSize: 16,
    fontWeight: '600',
  },
});