export default interface PriceRepositoryInterface<T> {
    create(entity: T): Promise<void>
    find(id: string): Promise<T | null>
    update(id: string, entity: T): Promise<void>
    getByProductId(id: string): Promise<T | null>
}