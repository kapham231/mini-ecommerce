/**
 * Dependency Injection Container
 * 
 * Simple DI pattern for managing module dependencies.
 * Each module registers its services and dependencies here.
 * 
 * Usage:
 * - In module setup: container.register('authService', new AuthService())
 * - In controllers/services: const authService = container.get('authService')
 */

interface ServiceRegistry {
    [key: string]: any;
}

class DIContainer {
    private services: ServiceRegistry = {};

    /**
     * Register a service in the container
     */
    register<T>(name: string, service: T): void {
        if (this.services[name]) {
            console.warn(`[DI] Service "${name}" is already registered. Overwriting...`);
        }
        this.services[name] = service;
    }

    /**
     * Retrieve a service from the container
     */
    get<T>(name: string): T {
        if (!this.services[name]) {
            throw new Error(`[DI] Service "${name}" not found in container`);
        }
        return this.services[name] as T;
    }

    /**
     * Check if a service is registered
     */
    has(name: string): boolean {
        return !!this.services[name];
    }

    /**
     * Get all registered services (useful for debugging)
     */
    getAll(): string[] {
        return Object.keys(this.services);
    }
}

// Export singleton instance
export const container = new DIContainer();
