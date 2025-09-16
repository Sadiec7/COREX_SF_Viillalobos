# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern Insurance Management System built with PySide6 - a demonstration of elegant native desktop UI capabilities that can compete with modern web applications.

## Development Setup

This is a Python PySide6 application. To set up the development environment:

```bash
# Install dependencies
pip install -r requirements.txt

# Or install PySide6 directly
pip install PySide6>=6.5.0
```

## Running the Application

```bash
# Run the main application
python main.py

# Demo credentials for login
# Username: admin
# Password: 123456
```

## Project Architecture

### Core Components
- **main.py**: Application entry point with window management and theme handling
- **login_window.py**: Custom frameless login window with animations
- **dashboard_window.py**: Main dashboard with sidebar navigation and content areas

### Widget System
- **widgets/custom_widgets.py**: Reusable UI components (MetricCard, AlertCard, CustomTable, etc.)
- **widgets/charts_widget.py**: Data visualization widgets using QPainter

### Styling
- **styles/styles.qss**: Complete QSS stylesheet with modern golden/blue theme
- Uses CSS-like syntax for Qt styling
- Supports hover effects, animations, and responsive design

## Key Features

### Design System
- **Color Palette**: Gold (#F4D03F, #D4AF37) and Dark Blue (#1B4F72, #2E86AB)
- **Typography**: Segoe UI with hierarchical font weights and sizes
- **Animations**: QPropertyAnimation for smooth transitions and micro-interactions
- **Effects**: Drop shadows, gradients, and hover states

### Custom Widgets
- `MetricCard`: Animated cards with metrics, trends, and hover effects
- `AlertCard`: Status alerts with different severity levels
- `CustomTable`: Styled tables with status indicators
- `RippleButton`: Material Design-style ripple effect buttons
- `LoadingSpinner`: Custom animated loading indicators
- `NotificationToast`: Non-intrusive notification system

### Window Management
- Frameless windows with custom title bars
- Smooth window transitions and animations
- Cross-window communication using Qt signals/slots

## Development Guidelines

### Code Style
- Follow PQT (Python Qt) naming conventions
- Use descriptive class and method names
- Separate UI setup from business logic
- Use Qt's signal/slot system for component communication

### Animation Best Practices
- Use QPropertyAnimation for smooth effects
- Set appropriate durations (200-800ms for UI animations)
- Use QEasingCurve for natural motion
- Avoid blocking the UI thread with animations

### Styling Guidelines
- Keep styles in external QSS files
- Use object names and CSS classes for styling
- Maintain consistent spacing and sizing
- Test hover and focus states

## Common Tasks

### Adding New Pages
1. Create widget class inheriting from QWidget
2. Add to DashboardWindow's content stack
3. Update sidebar navigation mapping
4. Implement page-specific functionality

### Creating Custom Widgets
1. Inherit from appropriate Qt widget base class
2. Implement `setup_ui()` method for layout
3. Add animations in `setup_animations()`
4. Apply styles using object names or CSS classes

### Modifying Styles
1. Edit `styles/styles.qss` for visual changes
2. Use CSS selectors with Qt property names
3. Test across different widget states
4. Maintain color palette consistency

## Demo Data

The application includes realistic sample data:
- 245 total policies
- 12 policies expiring this week
- $45,230 in pending collections
- 8 new clients this month
- Sample policy data with various statuses

## Architecture Patterns

### MVC-like Structure
- **Models**: Data structures and sample data in dashboard components
- **Views**: UI widgets and windows
- **Controllers**: Application class managing window transitions and state

### Event-Driven Communication
- Qt signals/slots for loose coupling
- Custom signals for business events (login_successful, logout_requested)
- Event propagation through widget hierarchy

This project demonstrates that PySide6 can create applications as visually appealing and interactive as modern web applications while maintaining native performance and OS integration.