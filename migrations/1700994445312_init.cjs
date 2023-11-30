/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    "tour",
    {
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
      id: "id",
      name: { type: "varchar(100)", notNull: true, unique: true },
      panorama_file: {
        type: "varchar(300)",
      },
    },
    {
      ifNotExists: true,
    }
  );

  pgm.createTable(
    "hotspot",
    {
      created_at: {
        type: "timestamp",
        notNull: true,
        default: pgm.func("current_timestamp"),
      },
      id: "id",
      name: { type: "varchar(100)", notNull: true },
      pitch: { type: "real", notNull: true },
      yaw: { type: "real", notNull: true },
      parent_id: {
        type: "integer",
        notNull: true,
        references: "tour",
      },
      hotspot_type: {
        type: "varchar(30)",
        notNull: true,
        check: "(hotspot_type in ('info', 'tour'))",
      },
      tour_id: {
        type: "integer",
        references: "tour",
      },
      site_link: {
        type: "varchar",
      },
    },
    {
      ifNotExists: true,
    }
  );
};

exports.down = (pgm) => {
  pgm.dropTable("tour", { ifExists: true, cascade: true });
  pgm.dropTable("hotspot", { ifExists: true, cascade: true });
};
