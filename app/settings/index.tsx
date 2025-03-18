import React, { useState, useEffect } from 'react';
import {useGoogleAuth} from '@/src/api/GoogleAuthService';
import {useSheetService} from '@/src/api/SheetService';
import {View,Text,StyleSheet,Image,TouchableOpacity,ScrollView,Modal,Dimensions,Linking,SafeAreaView,} from 'react-native';
import {Ionicons,MaterialIcons,MaterialCommunityIcons,FontAwesome5} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Spreadsheet = {
  id: string;
  name: string;
  lastModified?: string;
};

export default function SettingsScreen() {

  const {accessToken,userInfo,signOut} = useGoogleAuth();
  const {fetchUserSheets,handleSheetSelect}=useSheetService();
  const router=useRouter();
  const [spreadsheetModalVisible, setSpreadsheetModalVisible] = useState(false);
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[] | null>(null);
  // Theme colors (light theme only)
  const theme = {
    backgroundColor: '#F8F9FA',
    cardBackground: '#FFFFFF',
    textColor: '#212121',
    secondaryText: '#757575',
    accentColor: '#4F6CFF',
    dividerColor: '#EEEEEE',
    modalBackground: '#FFFFFF',
    inputBackground: '#F5F5F5',
  };

  // Fetch user sheets when the screen mounts or when accessToken changes
  useEffect(() => {
    if (accessToken) {
      console.log('Access token {}',accessToken);
      fetchUserSheets(accessToken)
        .then((files) => {
          setSpreadsheets(files);
        })
        .catch((error) => {
          console.error('Error fetching user sheets:', error);
        });
    }
  }, [accessToken]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const renderSettingItem = (
    icon:any,
    title:any,
    subtitle : any,
    action :any,
    rightElement :any,
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

           {/* <Image
              source={{ uri: userInfo.profileImage }}
              style={styles.profileImage}
            />*/}

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.textColor }]}>{userInfo?.name??'unknown'}</Text>
            <Text style={[styles.profileDetail, { color: theme.secondaryText }]}>
              <Ionicons name="mail-outline" size={14} /> {userInfo?.email??'unknown'}
            </Text>
          </View>

        </View>


        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Account</Text>
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            {renderSettingItem(
              'google-spreadsheet',
              'Spreadsheet',
              'Choose a Google Spreadsheet to work with',
              () => setSpreadsheetModalVisible(true),
              null,
              'material-community'
            )}
            {renderSettingItem(
              'sync',
              'Sync Data',
              'Last synced: Today at 2:30 PM',
              () => {},
              null,
              'material'
            )}
            {renderSettingItem(
              'notifications',
              'Notifications',
              'Manage your notification preferences',
              () => {},
              null,
              'material'
            )}
            {renderSettingItem(
              'star',
              'Rate Us',
              'Rate your experience with the app',
              () => Linking.openURL('https://example.com/rate'),
              null,

            )}
            {renderSettingItem(
              'exit-outline',
              'Sign Out',
              'Log out of your account',
              () => handleLogout(),
              null
            )}

          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.secondaryText }]}>
            Version 1.0.0 (Build 2025022501)
          </Text>
          <Text style={[styles.copyrightText, { color: theme.secondaryText }]}>
            © 2025 EasySheet By Nitesh. All rights reserved.
          </Text>
        </View>
      </ScrollView>


      {/* Spreadsheet Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={spreadsheetModalVisible}
        onRequestClose={() => setSpreadsheetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.modalBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>Select Spreadsheet</Text>
              <TouchableOpacity onPress={() => setSpreadsheetModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {spreadsheets?.map((sheet: Spreadsheet) => (
                <TouchableOpacity
                  key={sheet.id}
                  style={[styles.spreadsheetItem, { borderBottomColor: theme.dividerColor }]}
                  onPress={() => {handleSheetSelect(sheet.id);
                                        setSpreadsheetModalVisible(false);}}
                >
                  <View style={styles.spreadsheetIcon}>
                    <MaterialCommunityIcons
                      name="google-spreadsheet"
                      size={24}
                      color={theme.accentColor}
                    />
                  </View>
                  <View style={styles.spreadsheetInfo}>
                    <Text style={[styles.spreadsheetName, { color: theme.textColor }]}>
                      {sheet.name}
                    </Text>
                    <Text style={[styles.spreadsheetDate, { color: theme.secondaryText }]}>
                      Last modified: {sheet.lastModified}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  spreadsheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  spreadsheetIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(79, 108, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  spreadsheetInfo: {
    flex: 1,
  },
  spreadsheetName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  spreadsheetDate: {
    fontSize: 13,
  },
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