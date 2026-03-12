# RadiologyIQ - Multi-Role Navigation Guide

## 🎯 Quick Start

All role-based screens are now accessible! You can navigate between different user roles using the **Role Switcher** in the sidebar footer.

---

## 🚀 How to Navigate

### Method 1: Use the Role Switcher (Recommended)
1. Look at the **bottom of the sidebar** (footer)
2. Click on the **role selector dropdown** (shows current user/role)
3. Select a different role from the dropdown:
   - **Dr. Sarah Chen** - Radiologist
   - **James Park** - Admin
   - **David Kumar** - Technologist
   - **Robert Anderson** - Front Desk
   - **Dr. Michael Chen** - Referring Physician
4. The app will automatically navigate to that role's home screen and update the sidebar navigation

### Method 2: Direct URL Navigation
You can also navigate directly to any role's screens by typing the URL in your browser:

---

## 📋 All Available Routes

### 🩺 **Radiologist Role** (Golden Flow)
- **Worklist**: `/radiologist/worklist`
- **Templates**: `/radiologist/templates`
- **PACS Viewer**: `/radiologist/pacs-viewer/:caseId`
- **Case Review**: `/radiologist/case-review/:caseId`

**Navigation Items:**
- Home
- Worklist
- Templates
- Settings

---

### 🛡️ **Admin Role**
- **User Management**: `/admin/users`
- **Audit Logs**: `/admin/audit-logs`
- **System Settings**: `/admin/settings`

**Navigation Items:**
- Home
- User Management
- Audit Logs
- System Settings

**RBAC Restrictions:**
- ❌ No patient care or clinical actions
- ❌ Cannot access diagnostic images or reports
- ✅ Full system configuration and user management

---

### 🔬 **Technologist Role**
- **Imaging Worklist**: `/technologist/worklist`

**Navigation Items:**
- Home
- Imaging Worklist
- Settings

**RBAC Restrictions:**
- ❌ No reporting or sign-off (Radiologist only)
- ❌ Cannot modify patient demographics
- ✅ Can update study status and add technical notes

---

### 🏥 **Front Desk Role**
- **Patient Registration**: `/frontdesk/patients`
- **Appointment Scheduling**: `/frontdesk/appointments`

**Navigation Items:**
- Home
- Patient Registration
- Appointments
- Settings

**RBAC Restrictions:**
- ❌ No access to medical records or clinical data (HIPAA)
- ❌ Cannot view diagnostic images or reports
- ✅ Can register patients and manage appointments

---

### 👨‍⚕️ **Referring Physician Role**
- **Radiology Reports**: `/physician/reports`

**Navigation Items:**
- Home
- Radiology Reports
- Settings

**RBAC Restrictions:**
- ❌ READ-ONLY access to finalized reports
- ❌ Cannot modify or amend reports
- ❌ Cannot access draft/pending reports
- ✅ Can view and download reports for referred patients

---

## 🔄 Testing the Role System

### Quick Test Workflow:

1. **Start as Radiologist** (default)
   - Navigate to `/radiologist/worklist`
   - View the reporting worklist
   - Check template management

2. **Switch to Admin**
   - Click role switcher → Select "James Park (Admin)"
   - You'll see User Management screen
   - Try: Audit Logs, System Settings

3. **Switch to Technologist**
   - Click role switcher → Select "David Kumar (Technologist)"
   - View the Imaging Worklist
   - Try: Check-in patients, update status

4. **Switch to Front Desk**
   - Click role switcher → Select "Robert Anderson (Front Desk)"
   - Register new patients
   - Schedule appointments

5. **Switch to Referring Physician**
   - Click role switcher → Select "Dr. Michael Chen (Referring Physician)"
   - View finalized reports
   - Try: Download reports

---

## 🎨 Visual Indicators

Each role has:
- ✅ **Unique sidebar navigation** tailored to their permissions
- ✅ **Role-specific icons** in the sidebar
- ✅ **RBAC notices** on each screen explaining access level
- ✅ **Contextual actions** based on role permissions

---

## 🔐 RBAC Implementation

### Access Control Summary:

| Screen Type | Radiologist | Admin | Technologist | Front Desk | Physician |
|-------------|-------------|-------|--------------|------------|-----------|
| Patient Demographics | Read | Read/Write | Read | Read/Write | Read |
| Study Execution | Full | ❌ | Full | ❌ | ❌ |
| Reporting | Full | ❌ | ❌ | ❌ | Read-Only |
| System Config | ❌ | Full | ❌ | ❌ | ❌ |
| User Management | ❌ | Full | ❌ | ❌ | ❌ |
| Appointments | Read | Read | Read | Full | ❌ |

---

## 🚧 Next Steps for Production

1. **Add Authentication**
   - Implement login flow
   - Store user role in session/JWT
   - Enforce role checks server-side

2. **Route Guards**
   - Add protected route components
   - Redirect unauthorized users
   - Show 403 errors for forbidden access

3. **API Integration**
   - Connect to backend endpoints
   - Implement role-based API filtering
   - Add error handling

4. **Persistent Role State**
   - Store selected role in localStorage (for testing)
   - Retrieve role from authentication system (production)

---

## 📝 Development Notes

### File Structure:
```
/src/
├── app/
│   ├── components/
│   │   └── blocks/
│   │       └── role-switcher.tsx        # Role selection dropdown
│   └── router.tsx                        # All routes defined here
├── lib/
│   └── sidebar-config.ts                 # Role-based navigation config
└── pages/
    ├── admin/                            # Admin role screens
    ├── technologist/                     # Technologist role screens
    ├── frontdesk/                        # Front Desk role screens
    ├── physician/                        # Referring Physician screens
    └── radiologist/                      # Radiologist screens (golden flow)
```

### Key Configuration Files:
- **`/src/app/router.tsx`** - All route definitions
- **`/src/lib/sidebar-config.ts`** - Role-based sidebar menus
- **`/src/app/components/blocks/role-switcher.tsx`** - Role switching UI
- **`/src/app/components/blocks/global-sidebar.tsx`** - Sidebar with role support

---

## 🎯 Pro Tips

1. **Use the role switcher** in the sidebar footer for quick testing
2. **Each role has a default landing page** that opens when you switch
3. **The sidebar navigation updates** automatically based on selected role
4. **All screens include RBAC annotations** - check the blue info boxes
5. **Mock data is role-specific** - each screen has realistic test data

---

## ✅ Testing Checklist

- [ ] Can switch between all 5 roles using the sidebar dropdown
- [ ] Each role shows different navigation menu items
- [ ] Direct URL navigation works for all routes
- [ ] RBAC notices display correctly on each screen
- [ ] Role-specific functionality is properly restricted
- [ ] Mock data is realistic and role-appropriate

---

## 🆘 Troubleshooting

**Sidebar not updating?**
- Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)

**Role switcher not visible?**
- Make sure you're on a route that uses AppShell (not login/PACS viewer)

**Navigation items not showing?**
- Check console for errors
- Verify route is defined in `/src/app/router.tsx`

**Page not found?**
- Ensure you're using the correct route path
- Check the routes table above

---

## 📞 Support

For questions about the implementation:
- Review the RBAC comments in each screen file
- Check the backend integration notes in component headers
- Refer to the role-specific restrictions documented above

---

**Happy Testing! 🎉**

The entire multi-role RadiologyIQ system is now ready for your POC demonstration!
