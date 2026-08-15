-- =========================================================
-- WMS MVP
-- Database schema v0.1
-- =========================================================

CREATE DATABASE IF NOT EXISTS wms
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE wms;

SET FOREIGN_KEY_CHECKS = 0;


-- =========================================================
-- DROP TABLES
-- =========================================================

DROP TABLE IF EXISTS audit_logs;

DROP TABLE IF EXISTS inventory_movements;
DROP TABLE IF EXISTS inventory;

DROP TABLE IF EXISTS box_movements;
DROP TABLE IF EXISTS box_items;
DROP TABLE IF EXISTS boxes;

DROP TABLE IF EXISTS receiving_items;
DROP TABLE IF EXISTS receivings;

DROP TABLE IF EXISTS request_operations;
DROP TABLE IF EXISTS operation_types;

DROP TABLE IF EXISTS request_items;
DROP TABLE IF EXISTS requests;

DROP TABLE IF EXISTS products;

DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS racks;
DROP TABLE IF EXISTS zones;
DROP TABLE IF EXISTS warehouses;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

DROP TABLE IF EXISTS clients;


SET FOREIGN_KEY_CHECKS = 1;


-- =========================================================
-- CORE
-- =========================================================

-- ---------------------------------------------------------
-- CLIENTS
-- ---------------------------------------------------------

CREATE TABLE clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    client_type VARCHAR(100),

    email VARCHAR(255),
    phone VARCHAR(50),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- ROLES
-- ---------------------------------------------------------

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(100) NOT NULL
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- USERS
-- ---------------------------------------------------------

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    role_id BIGINT UNSIGNED NOT NULL,

    -- NULL для внутренних сотрудников.
    -- Заполняется для пользователей конкретного клиента.
    client_id BIGINT UNSIGNED NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    full_name VARCHAR(255) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_users_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =========================================================
-- WAREHOUSE STRUCTURE
-- =========================================================

-- ---------------------------------------------------------
-- WAREHOUSES
-- ---------------------------------------------------------

CREATE TABLE warehouses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    code VARCHAR(50) NOT NULL UNIQUE,

    address VARCHAR(500),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- ZONES
-- ---------------------------------------------------------

CREATE TABLE zones (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    warehouse_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(255) NOT NULL,

    code VARCHAR(50) NOT NULL,

    zone_type VARCHAR(50) NOT NULL DEFAULT 'STORAGE',

    CONSTRAINT uq_zones_warehouse_code
        UNIQUE (warehouse_id, code),

    CONSTRAINT fk_zones_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- RACKS
-- ---------------------------------------------------------

CREATE TABLE racks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    zone_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(255) NOT NULL,

    code VARCHAR(50) NOT NULL,

    CONSTRAINT uq_racks_zone_code
        UNIQUE (zone_id, code),

    CONSTRAINT fk_racks_zone
        FOREIGN KEY (zone_id)
        REFERENCES zones(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- LOCATIONS
-- ---------------------------------------------------------

CREATE TABLE locations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    rack_id BIGINT UNSIGNED NOT NULL,

    code VARCHAR(100) NOT NULL,

    capacity DECIMAL(14,3),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT uq_locations_rack_code
        UNIQUE (rack_id, code),

    CONSTRAINT fk_locations_rack
        FOREIGN KEY (rack_id)
        REFERENCES racks(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =========================================================
-- PRODUCTS
-- =========================================================

-- Товар принадлежит клиенту.
--
-- Например:
--
-- Client A
--   ├── iPhone 15
--   └── AirPods
--
-- Client B
--   ├── Samsung A55
--   └── Galaxy Buds
--
-- Поэтому один и тот же SKU разных клиентов
-- может существовать независимо.

CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    client_id BIGINT UNSIGNED NOT NULL,

    sku VARCHAR(100) NOT NULL,

    barcode VARCHAR(100),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    unit VARCHAR(30) NOT NULL DEFAULT 'pcs',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_products_client_sku
        UNIQUE (client_id, sku),

    CONSTRAINT fk_products_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE INDEX idx_products_client
    ON products(client_id);

CREATE INDEX idx_products_barcode
    ON products(barcode);


-- =========================================================
-- REQUESTS
-- =========================================================

-- Заявка клиента на приемку товара.

CREATE TABLE requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    client_id BIGINT UNSIGNED NOT NULL,

    request_number VARCHAR(50) NOT NULL,

    planned_delivery_date DATE,

    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',

    comment TEXT,

    created_by BIGINT UNSIGNED NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_requests_client_number
        UNIQUE (client_id, request_number),

    CONSTRAINT fk_requests_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_requests_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE INDEX idx_requests_client
    ON requests(client_id);

CREATE INDEX idx_requests_status
    ON requests(status);


-- ---------------------------------------------------------
-- REQUEST ITEMS
-- ---------------------------------------------------------

CREATE TABLE request_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    request_id BIGINT UNSIGNED NOT NULL,

    product_id BIGINT UNSIGNED NOT NULL,

    expected_quantity DECIMAL(14,3) NOT NULL,

    received_quantity DECIMAL(14,3) NOT NULL DEFAULT 0,

    CONSTRAINT chk_request_items_expected
        CHECK (expected_quantity > 0),

    CONSTRAINT chk_request_items_received
        CHECK (received_quantity >= 0),

    CONSTRAINT uq_request_product
        UNIQUE (request_id, product_id),

    CONSTRAINT fk_request_items_request
        FOREIGN KEY (request_id)
        REFERENCES requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_request_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE INDEX idx_request_items_product
    ON request_items(product_id);


-- =========================================================
-- PROCESSING / TECHNICAL TASK
-- =========================================================

-- Справочник возможных складских операций.

CREATE TABLE operation_types (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    code VARCHAR(50) NOT NULL UNIQUE,

    name VARCHAR(255) NOT NULL,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- REQUEST OPERATIONS
-- ---------------------------------------------------------

-- Конкретные операции для конкретной заявки.
--
-- Например:
--
-- 1. Пересчитать
-- 2. Проверить брак
-- 3. Нанести маркировку
-- 4. Перепаковать

CREATE TABLE request_operations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    request_id BIGINT UNSIGNED NOT NULL,

    operation_type_id BIGINT UNSIGNED NOT NULL,

    operation_order INT UNSIGNED NOT NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',

    instructions TEXT,

    assigned_to BIGINT UNSIGNED NULL,

    started_at DATETIME,

    completed_at DATETIME,

    CONSTRAINT uq_request_operation_order
        UNIQUE (request_id, operation_order),

    CONSTRAINT fk_request_operations_request
        FOREIGN KEY (request_id)
        REFERENCES requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_request_operations_type
        FOREIGN KEY (operation_type_id)
        REFERENCES operation_types(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_request_operations_user
        FOREIGN KEY (assigned_to)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;


-- =========================================================
-- RECEIVING
-- =========================================================

-- Факт приемки конкретной заявки.

CREATE TABLE receivings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    request_id BIGINT UNSIGNED NOT NULL,

    received_by BIGINT UNSIGNED NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',

    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    completed_at DATETIME,

    CONSTRAINT fk_receivings_request
        FOREIGN KEY (request_id)
        REFERENCES requests(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_receivings_user
        FOREIGN KEY (received_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;


-- ---------------------------------------------------------
-- RECEIVING ITEMS
-- ---------------------------------------------------------

CREATE TABLE receiving_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    receiving_id BIGINT UNSIGNED NOT NULL,

    request_item_id BIGINT UNSIGNED NOT NULL,

    accepted_quantity DECIMAL(14,3) NOT NULL DEFAULT 0,

    rejected_quantity DECIMAL(14,3) NOT NULL DEFAULT 0,

    barcode_scanned VARCHAR(100),

    comment TEXT,

    CONSTRAINT chk_receiving_accepted
        CHECK (accepted_quantity >= 0),

    CONSTRAINT chk_receiving_rejected
        CHECK (rejected_quantity >= 0),

    CONSTRAINT fk_receiving_items_receiving
        FOREIGN KEY (receiving_id)
        REFERENCES receivings(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_receiving_items_request_item
        FOREIGN KEY (request_item_id)
        REFERENCES request_items(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;


-- =========================================================
-- BOXES
-- =========================================================

-- ВАЖНО:
--
-- Короб НЕ принадлежит клиенту.
--
-- Короб является физической тарой склада.
--
-- Поэтому в одном коробе потенциально могут находиться
-- товары разных клиентов.
--
-- Клиент определяется через:
--
-- box_items
--      ↓
-- products
--      ↓
-- clients

CREATE TABLE boxes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    warehouse_id BIGINT UNSIGNED NOT NULL,

    box_number VARCHAR(100) NOT NULL,

    location_id BIGINT UNSIGNED NULL,

    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT uq_boxes_warehouse_number
        UNIQUE (warehouse_id, box_number),

    CONSTRAINT fk_boxes_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_boxes_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE INDEX idx_boxes_location
    ON boxes(location_id);


-- ---------------------------------------------------------
-- BOX ITEMS
-- ---------------------------------------------------------

-- Содержимое коробов.
--
-- Один короб может содержать несколько товаров.
-- Товары потенциально могут принадлежать разным клиентам.

CREATE TABLE box_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    box_id BIGINT UNSIGNED NOT NULL,

    product_id BIGINT UNSIGNED NOT NULL,

    quantity DECIMAL(14,3) NOT NULL,

    CONSTRAINT chk_box_items_quantity
        CHECK (quantity > 0),

    CONSTRAINT uq_box_product
        UNIQUE (box_id, product_id),

    CONSTRAINT fk_box_items_box
        FOREIGN KEY (box_id)
        REFERENCES boxes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_box_items_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE INDEX idx_box_items_product
    ON box_items(product_id);


-- =========================================================
-- BOX MOVEMENTS
-- =========================================================

-- История перемещения физического короба.

CREATE TABLE box_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    box_id BIGINT UNSIGNED NOT NULL,

    from_location_id BIGINT UNSIGNED NULL,

    to_location_id BIGINT UNSIGNED NULL,

    moved_by BIGINT UNSIGNED NULL,

    reason VARCHAR(100),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_box_movements_box
        FOREIGN KEY (box_id)
        REFERENCES boxes(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_box_movements_from_location
        FOREIGN KEY (from_location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_box_movements_to_location
        FOREIGN KEY (to_location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_box_movements_user
        FOREIGN KEY (moved_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE INDEX idx_box_movements_box_created
    ON box_movements(box_id, created_at);


-- =========================================================
-- INVENTORY
-- =========================================================

-- Текущее состояние остатков.
--
-- CLIENT здесь НЕ хранится.
--
-- Клиент определяется через:
--
-- inventory
--    ↓
-- product
--    ↓
-- client

CREATE TABLE inventory (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,

    location_id BIGINT UNSIGNED NOT NULL,

    box_id BIGINT UNSIGNED NULL,

    quantity DECIMAL(14,3) NOT NULL DEFAULT 0,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_inventory_quantity
        CHECK (quantity >= 0),

    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_location
        FOREIGN KEY (location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_box
        FOREIGN KEY (box_id)
        REFERENCES boxes(id)
        ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE INDEX idx_inventory_product
    ON inventory(product_id);

CREATE INDEX idx_inventory_location
    ON inventory(location_id);

CREATE INDEX idx_inventory_box
    ON inventory(box_id);


-- =========================================================
-- INVENTORY MOVEMENTS
-- =========================================================

-- История изменения остатков.
--
-- Это журнал складских движений:
--
-- RECEIVE
-- MOVE
-- WRITE_OFF
-- SHIPMENT
-- ADJUSTMENT
-- и т.д.

CREATE TABLE inventory_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    product_id BIGINT UNSIGNED NOT NULL,

    box_id BIGINT UNSIGNED NULL,

    from_location_id BIGINT UNSIGNED NULL,

    to_location_id BIGINT UNSIGNED NULL,

    quantity DECIMAL(14,3) NOT NULL,

    movement_type VARCHAR(50) NOT NULL,

    reference_type VARCHAR(50),

    reference_id BIGINT UNSIGNED,

    performed_by BIGINT UNSIGNED NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_inventory_movements_quantity
        CHECK (quantity > 0),

    CONSTRAINT fk_inventory_movements_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_movements_box
        FOREIGN KEY (box_id)
        REFERENCES boxes(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_movements_from_location
        FOREIGN KEY (from_location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_movements_to_location
        FOREIGN KEY (to_location_id)
        REFERENCES locations(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_inventory_movements_user
        FOREIGN KEY (performed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE INDEX idx_inventory_movements_product
    ON inventory_movements(product_id, created_at);

CREATE INDEX idx_inventory_movements_box
    ON inventory_movements(box_id, created_at);


-- =========================================================
-- AUDIT LOG
-- =========================================================

CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NULL,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(100) NOT NULL,

    entity_id BIGINT UNSIGNED NULL,

    details JSON,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE INDEX idx_audit_entity
    ON audit_logs(entity_type, entity_id, created_at);


-- =========================================================
-- INITIAL REFERENCE DATA
-- =========================================================

INSERT INTO roles (code, name) VALUES
    ('ADMIN', 'Администратор'),
    ('MANAGER', 'Руководитель'),
    ('FOREMAN', 'Бригадир'),
    ('WAREHOUSE_EMPLOYEE', 'Сотрудник склада'),
    ('CLIENT', 'Клиент');


INSERT INTO operation_types (code, name, description) VALUES
    (
        'COUNT',
        'Пересчет',
        'Проверка фактического количества товара'
    ),
    (
        'SORT',
        'Сортировка',
        'Сортировка товара'
    ),
    (
        'REPACK',
        'Замена упаковки',
        'Замена или дополнительная упаковка'
    ),
    (
        'LABEL',
        'Маркировка',
        'Нанесение этикетки или штрихкода'
    ),
    (
        'QUALITY_CHECK',
        'Проверка на брак',
        'Проверка товара на брак'
    );