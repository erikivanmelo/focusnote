!macro preInit
    ; This will enable the correct app data path for the uninstaller
    SetRegView 64
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    SetRegView 32
    WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
    WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$INSTDIR"
!macroend

!macro customInstall
    ; Create desktop shortcut
    CreateShortCut "$DESKTOP\\${PRODUCT_NAME}.lnk" "$INSTDIR\\${APP_EXEC}"
    
    ; Create start menu shortcut
    CreateDirectory "$SMPROGRAMS\\${PRODUCT_NAME}"
    CreateShortCut "$SMPROGRAMS\\${PRODUCT_NAME}\\${PRODUCT_NAME}.lnk" "$INSTDIR\\${APP_EXEC}" "" "$INSTDIR\\${APP_EXEC}" 0
    CreateShortCut "$SMPROGRAMS\\${PRODUCT_NAME}\\Uninstall ${PRODUCT_NAME}.lnk" "$INSTDIR\\Uninstall ${PRODUCT_NAME}.exe"
!macroend

!macro customUnInstall
    ; Remove desktop shortcut
    Delete "$DESKTOP\\${PRODUCT_NAME}.lnk"
    
    ; Remove start menu shortcuts
    RMDir /r "$SMPROGRAMS\\${PRODUCT_NAME}"
!macroend
