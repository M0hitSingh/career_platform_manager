#!/usr/bin/env python3
"""
Simple Selenium automation script for Career Platform (No WebDriver Manager)
This version tries to use system-installed browsers without downloading drivers.
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import time
import sys


# Configuration - UPDATE THESE WITH YOUR CREDENTIALS
BASE_URL = "http://localhost:5173"
EMAIL = "admin@testing.com"  # UPDATE THIS
PASSWORD = "golchi"        # UPDATE THIS
COMPANY_SLUG = "testing"  # UPDATE THIS


# Delays for visibility
DELAY = 0.5  # seconds between actions

def setup_driver():
    """Setup browser driver - tries Chrome, Edge, then Firefox"""
    print("🔧 Setting up browser driver...")
    
    # Try Chrome first
    try:
        print("🌐 Trying Chrome...")
        chrome_options = ChromeOptions()
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        
        driver = webdriver.Chrome(options=chrome_options)
        print("✅ Chrome driver setup successful!")
        return driver
        
    except Exception as e:
        print(f"❌ Chrome failed: {e}")
    
    # Try Edge as fallback
    try:
        print("🌐 Trying Microsoft Edge...")
        edge_options = EdgeOptions()
        edge_options.add_argument("--start-maximized")
        
        driver = webdriver.Edge(options=edge_options)
        print("✅ Edge driver setup successful!")
        return driver
        
    except Exception as e:
        print(f"❌ Edge failed: {e}")
    
    # Try Firefox as last resort
    try:
        print("🌐 Trying Firefox...")
        firefox_options = FirefoxOptions()
        
        driver = webdriver.Firefox(options=firefox_options)
        driver.maximize_window()
        print("✅ Firefox driver setup successful!")
        return driver
        
    except Exception as e:
        print(f"❌ Firefox failed: {e}")
    
    # If all fail, provide helpful error message
    print("❌ All browser drivers failed!")
    print("💡 Solutions:")
    print("   1. Install Chrome: https://www.google.com/chrome/")
    print("   2. Or use Edge (should be pre-installed on Windows)")
    print("   3. Make sure browser is in PATH or try: pip install webdriver-manager")
    sys.exit(1)

def wait_and_click(driver, locator, timeout=5):
    """Wait for element and click it"""
    element = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable(locator)
    )
    element.click()
    time.sleep(DELAY)
    return element

def wait_and_send_keys(driver, locator, text, timeout=5):
    """Wait for element and send keys"""
    element = WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located(locator)
    )
    element.clear()
    element.send_keys(text)
    time.sleep(DELAY)
    return element

def login(driver):
    """Login to the application"""
    print("🔐 Starting login process...")
    
    # Navigate to login page
    driver.get(f"{BASE_URL}/login")
    
    # Fill login form
    print("📝 Filling login credentials...")
    wait_and_send_keys(driver, (By.ID, "email"), EMAIL)
    wait_and_send_keys(driver, (By.ID, "password"), PASSWORD)
    
    # Click login button
    print("🚀 Clicking login button...")
    wait_and_click(driver, (By.CSS_SELECTOR, "button[type='submit']"))
    
    # Wait for redirect to dashboard
    WebDriverWait(driver, 8).until(
        lambda d: "/dashboard" in d.current_url
    )
    print("✅ Login successful!")

def check_dashboard(driver):
    """Check dashboard elements"""
    print("📊 Checking dashboard...")
    
    # Wait for dashboard to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "h1, .text-3xl"))
    )
    
    print("✅ Dashboard loaded successfully!")
    
    # Debug: Print available buttons and links
    print("🔍 Available buttons and links on dashboard:")
    try:
        buttons = driver.find_elements(By.TAG_NAME, "button")
        links = driver.find_elements(By.TAG_NAME, "a")
        
        for i, button in enumerate(buttons[:10]):  # Show first 10 buttons
            text = button.text.strip()
            if text:
                print(f"   Button {i+1}: '{text}'")
        
        for i, link in enumerate(links[:10]):  # Show first 10 links
            text = link.text.strip()
            href = link.get_attribute('href')
            if text:
                print(f"   Link {i+1}: '{text}' -> {href}")
    except Exception as e:
        print(f"   Debug failed: {e}")
    
    time.sleep(DELAY)

def manage_jobs_flow(driver):
    """Go to manage jobs, apply filter, and do pagination"""
    print("💼 Going to manage jobs...")
    
    # Try multiple selectors for manage jobs button
    manage_jobs_selectors = [
        "//button[contains(text(), 'Manage Jobs')]",
        "//a[contains(text(), 'Manage Jobs')]",
        "//button[contains(text(), 'Jobs')]",
        "//a[contains(text(), 'Jobs')]",
        "//button[contains(@href, 'manage-jobs')]",
        "//a[contains(@href, 'manage-jobs')]",
        "//button[contains(@href, 'jobs')]",
        "//a[contains(@href, 'jobs')]"
    ]
    
    manage_jobs_button = None
    for selector in manage_jobs_selectors:
        try:
            manage_jobs_button = WebDriverWait(driver, 1).until(
                EC.element_to_be_clickable((By.XPATH, selector))
            )
            print(f"✅ Found manage jobs button with selector: {selector}")
            break
        except:
            continue
    
    if not manage_jobs_button:
        print("⚠️ Could not find Manage Jobs button, trying direct navigation...")
        driver.get(f"{BASE_URL}/{COMPANY_SLUG}/manage-jobs")
    else:
        manage_jobs_button.click()
    
    # Wait for manage jobs page to load
    WebDriverWait(driver, 5).until(
        lambda d: "/manage-jobs" in d.current_url
    )
    print("✅ Manage jobs page loaded!")
    
    # Try to apply a filter (if filter elements exist)
    try:
        print("🔍 Looking for filters...")
        filter_elements = driver.find_elements(By.CSS_SELECTOR, "select, input[type='search'], .filter")
        if filter_elements:
            print("📋 Found filter elements, interacting with first one...")
            filter_elements[0].click()
        else:
            print("ℹ️ No filter elements found, skipping filter step")
    except Exception as e:
        print(f"ℹ️ Filter interaction failed: {e}")
    
    # Try pagination (if pagination exists)
    try:
        print("📄 Looking for pagination...")
        pagination_elements = driver.find_elements(By.CSS_SELECTOR, ".pagination button, button[aria-label*='page'], button:contains('Next')")
        if pagination_elements:
            print("➡️ Found pagination, clicking next page...")
            pagination_elements[0].click()
            time.sleep(DELAY)
        else:
            print("ℹ️ No pagination found, skipping pagination step")
    except Exception as e:
        print(f"ℹ️ Pagination interaction failed: {e}")
    
    print("✅ Manage jobs flow completed!")

def go_back_to_dashboard(driver):
    """Navigate back to dashboard"""
    print("🏠 Going back to dashboard...")
    
    # Try multiple ways to get back to dashboard
    back_selectors = [
        "//button[contains(text(), 'Back to Dashboard')]",
        "//a[contains(text(), 'Dashboard')]",
        "//button[contains(text(), 'Dashboard')]",
        "//a[contains(@href, 'dashboard')]",
        "//button[title='Back to Dashboard']"
    ]
    
    back_button = None
    for selector in back_selectors:
        try:
            back_button = driver.find_element(By.XPATH, selector)
            back_button.click()
            time.sleep(DELAY)
            print("✅ Used back button!")
            return
        except:
            continue
    
    # If no back button found, navigate directly
    print("⚠️ No back button found, navigating directly...")
    driver.get(f"{BASE_URL}/{COMPANY_SLUG}/dashboard")
    time.sleep(DELAY)
    print("✅ Back to dashboard!")

def edit_page_flow(driver):
    """Go to edit page, add component, save and publish"""
    print("✏️ Going to edit page...")
    
    # Try multiple selectors for edit button
    edit_selectors = [
        "//button[contains(text(), 'Edit Careers Page')]",
        "//a[contains(text(), 'Edit Careers Page')]",
        "//button[contains(text(), 'Edit')]",
        "//a[contains(text(), 'Edit')]",
        "//button[contains(@href, 'edit')]",
        "//a[contains(@href, 'edit')]"
    ]
    
    edit_button = None
    for selector in edit_selectors:
        try:
            edit_button = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable((By.XPATH, selector))
            )
            print(f"✅ Found edit button with selector: {selector}")
            break
        except:
            continue
    
    if not edit_button:
        print("⚠️ Could not find Edit button, trying direct navigation...")
        driver.get(f"{BASE_URL}/{COMPANY_SLUG}/edit")
        time.sleep(DELAY)
    else:
        edit_button.click()
        time.sleep(DELAY)
    
    # Wait for edit page to load
    WebDriverWait(driver, 10).until(
        lambda d: "/edit" in d.current_url
    )
    print("✅ Edit page loaded!")
    time.sleep(DELAY)
    
    # Add a component
    print("🧩 Adding a component...")
    try:
        # Look for component library or add component buttons
        component_buttons = driver.find_elements(By.CSS_SELECTOR, 
            ".component-library button, button[data-component], .add-component, button:contains('Add'), button:contains('Company Banner'), button:contains('About Section')")
        
        if component_buttons:
            print("🎯 Found component buttons, clicking first one...")
            component_buttons[0].click()
            time.sleep(DELAY)
            
            # If a modal opens, try to confirm/save
            try:
                confirm_buttons = driver.find_elements(By.CSS_SELECTOR, "button:contains('Add'), button:contains('Save'), button:contains('Confirm')")
                if confirm_buttons:
                    confirm_buttons[0].click()
                    time.sleep(DELAY)
            except:
                pass
        else:
            print("ℹ️ No component buttons found, skipping component addition")
    except Exception as e:
        print(f"ℹ️ Component addition failed: {e}")
    
    # Save the page
    print("💾 Saving the page...")
    try:
        save_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Save')]"))
        )
        save_button.click()
        time.sleep(DELAY)
        print("✅ Page saved!")
    except Exception as e:
        print(f"ℹ️ Save failed: {e}")
    
    # Publish the page
    print("🚀 Publishing the page...")
    try:
        publish_button = WebDriverWait(driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Publish')]"))
        )
        publish_button.click()
        time.sleep(DELAY * 2)  # Wait a bit longer for publish to complete
        print("✅ Page published!")
    except Exception as e:
        print(f"ℹ️ Publish failed: {e}")
    
    # Look for and click the "Open" button to view published page
    print("🌐 Looking for Open button to view published page...")
    try:
        # Try multiple selectors for the open button
        open_selectors = [
            "//button[contains(text(), 'Open')]",
            "//a[contains(text(), 'Open')]",
            "//button[contains(text(), 'View')]",
            "//a[contains(text(), 'View')]",
            "//button[contains(text(), 'Visit')]",
            "//a[contains(text(), 'Visit')]"
        ]
        
        open_button = None
        for selector in open_selectors:
            try:
                open_button = WebDriverWait(driver, 2).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                print(f"✅ Found open button with selector: {selector}")
                break
            except:
                continue
        
        if open_button:
            # Store current window handle
            original_window = driver.current_window_handle
            
            # Click the open button
            open_button.click()
            print("🔗 Clicked Open button!")
            time.sleep(DELAY)
            
            # Wait for new window/tab to open
            WebDriverWait(driver, 5).until(lambda d: len(d.window_handles) > 1)
            
            # Switch to the new window/tab
            for window_handle in driver.window_handles:
                if window_handle != original_window:
                    driver.switch_to.window(window_handle)
                    break
            
            print("🆕 Switched to new tab/window!")
            
            # Wait for the published page to load and check if it renders
            print("⏳ Waiting for published page to load...")
            try:
                # Wait for page to load completely
                WebDriverWait(driver, 10).until(
                    lambda d: d.execute_script("return document.readyState") == "complete"
                )
                
                # Check if page has content (look for common elements)
                page_elements = driver.find_elements(By.CSS_SELECTOR, "body, main, div, h1, h2, p")
                if page_elements:
                    print(f"✅ Published page loaded successfully! Found {len(page_elements)} elements.")
                    
                    # Get page title and URL for verification
                    page_title = driver.title
                    page_url = driver.current_url
                    print(f"📄 Page Title: '{page_title}'")
                    print(f"🔗 Page URL: {page_url}")
                    
                    # Check if it looks like a careers page
                    page_text = driver.find_element(By.TAG_NAME, "body").text.lower()
                    if any(keyword in page_text for keyword in ['career', 'job', 'position', 'hiring', 'work']):
                        print("🎯 Confirmed: This appears to be a careers page!")
                    else:
                        print("ℹ️ Page loaded but doesn't appear to be careers-related")
                else:
                    print("⚠️ Published page loaded but appears to be empty")
                
                # Stay on the published page for a moment to see it
                print("👀 Viewing published page for 3 seconds...")
                time.sleep(3)
                
            except Exception as e:
                print(f"⚠️ Error checking published page: {e}")
            
            # Switch back to original window
            driver.switch_to.window(original_window)
            print("🔙 Switched back to editor window")
            
        else:
            print("⚠️ Could not find Open button - page may have been published without open option")
            
    except Exception as e:
        print(f"ℹ️ Open button interaction failed: {e}")
    
    print("✅ Edit page flow completed!")

def main():
    """Main automation flow"""
    print("🤖 Starting Career Platform Automation")
    print("=" * 50)
    
    driver = setup_driver()
    
    try:
        # Step 1: Login
        login(driver)
        
        # Step 2: Check dashboard
        check_dashboard(driver)
        
        # Step 3: Manage jobs flow
        manage_jobs_flow(driver)
        
        # Step 4: Go back to dashboard
        go_back_to_dashboard(driver)
        
        # Step 5: Edit page flow
        edit_page_flow(driver)
        
        print("=" * 50)
        print("🎉 Automation completed successfully!")
        print("Browser will remain open for 15 seconds to review...")
        time.sleep(15)
        
    except Exception as e:
        print(f"❌ Error occurred: {e}")
        print("Browser will remain open for inspection...")
        time.sleep(30)
    
    finally:
        driver.quit()
        print("🔚 Browser closed. Automation finished.")

if __name__ == "__main__":
    main()