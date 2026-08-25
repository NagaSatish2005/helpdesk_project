/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'helpdesk.theme'
const THEME_VALUES = ['light', 'dark', 'system']

const ThemeContext = createContext(null)

function getStoredTheme() {
	if (typeof window === 'undefined') return 'system'

	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
	return THEME_VALUES.includes(storedTheme) ? storedTheme : 'system'
}

function getSystemTheme() {
	if (typeof window === 'undefined' || !window.matchMedia) return 'light'
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
	const resolvedTheme = theme === 'system' ? getSystemTheme() : theme
	const root = document.documentElement
	root.dataset.theme = resolvedTheme
	root.style.colorScheme = resolvedTheme
}

export function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(getStoredTheme)
	const [systemTheme, setSystemTheme] = useState(getSystemTheme)
	const resolvedTheme = theme === 'system' ? systemTheme : theme

	useLayoutEffect(() => {
		applyTheme(theme)
	}, [theme])

	useEffect(() => {
		if (typeof window === 'undefined') return undefined

		window.localStorage.setItem(THEME_STORAGE_KEY, theme)

		if (theme !== 'system' || !window.matchMedia) return undefined

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		const handleSystemThemeChange = (event) => {
			const nextSystemTheme = event.matches ? 'dark' : 'light'
			setSystemTheme(nextSystemTheme)
			applyTheme(nextSystemTheme)
		}
		mediaQuery.addEventListener?.('change', handleSystemThemeChange)

		return () => mediaQuery.removeEventListener?.('change', handleSystemThemeChange)
	}, [theme])

	const setTheme = (nextTheme) => {
		if (!THEME_VALUES.includes(nextTheme)) {
			throw new Error(`Unsupported theme "${nextTheme}". Use light, dark, or system.`)
		}
		setThemeState(nextTheme)
	}

	const toggleTheme = () => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}

	const value = {
		theme,
		currentTheme: theme,
		resolvedTheme,
		setTheme,
		toggleTheme,
	}

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
	const context = useContext(ThemeContext)
	if (!context) throw new Error('useThemeContext must be used within a ThemeProvider')
	return context
}
